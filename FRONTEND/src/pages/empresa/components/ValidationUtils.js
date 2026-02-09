// ValidationUtils.js - Utilidades de validación frontend reutilizables

// Validator principal
class FormValidator {
  constructor(rules) {
    this.rules = rules;
    this.errors = {};
  }

  validate(data) {
    this.errors = {};

    Object.keys(this.rules).forEach((field) => {
      const fieldRules = this.rules[field];
      const value = data[field];

      fieldRules.forEach((rule) => {
        if (!this.validateRule(rule, value, field)) {
          if (!this.errors[field]) {
            this.errors[field] = [];
          }
          this.errors[field].push(rule.message);
        }
      });
    });

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors,
    };
  }

  validateRule(rule, value, field) {
    const { type, message } = rule;

    switch (type) {
      case "required":
        return value !== undefined && value !== null && value !== "";

      case "minLength":
        return !value || value.length >= rule.value;

      case "maxLength":
        return !value || value.length <= rule.value;

      case "email":
        return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      case "rutChileno":
        return !value || this.validateRUT(value);

      case "numeric":
        return !value || (!isNaN(value) && value.trim() !== "");

      case "min":
        return !value || parseFloat(value) >= rule.value;

      case "max":
        return !value || parseFloat(value) <= rule.value;

      case "pattern":
        return !value || new RegExp(rule.value).test(value);

      case "enum":
        return !value || rule.options.includes(value);

      case "futureDate":
        return !value || new Date(value) > new Date();

      case "pastDate":
        return !value || new Date(value) < new Date();

      default:
        return true;
    }
  }

  // Validación específica para RUT chileno
  validateRUT(rut) {
    if (!rut) return true;

    // Limpiar el RUT
    const cleanRut = rut.replace(/[.-]/g, "").toUpperCase();

    if (cleanRut.length < 8 || cleanRut.length > 9) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    // Calcular dígito verificador
    let sum = 0;
    let multiple = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i)) * multiple;
      multiple = multiple === 7 ? 2 : multiple + 1;
    }

    const calculatedDV = 11 - (sum % 11);
    const finalDV =
      calculatedDV === 11
        ? "0"
        : calculatedDV === 10
          ? "K"
          : calculatedDV.toString();

    return finalDV === dv;
  }

  // Formatear RUT chileno
  formatRUT(rut) {
    if (!rut) return "";

    const cleanRut = rut.replace(/[.-]/g, "").toUpperCase();
    if (cleanRut.length < 2) return cleanRut;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    let formattedBody = "";
    let count = 0;

    for (let i = body.length - 1; i >= 0; i--) {
      if (count === 3 && i > 0) {
        formattedBody = "." + formattedBody;
        count = 0;
      }
      formattedBody = body.charAt(i) + formattedBody;
      count++;
    }

    return formattedBody + "-" + dv;
  }

  // Formatear moneda chilena
  formatCurrency(amount) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount || 0);
  }

  // Mostrar errores en formulario
  showErrors(form) {
    Object.keys(this.errors).forEach((field) => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input) {
        // Agregar clases de error
        input.classList.add(
          "border-red-500",
          "focus:border-red-500",
          "focus:ring-red-500",
        );
        input.classList.remove(
          "border-core-gray",
          "focus:border-core-primary",
          "focus:ring-core-primary",
        );

        // Mostrar mensaje de error
        let errorElement = input.parentElement.querySelector(".error-message");
        if (!errorElement) {
          errorElement = document.createElement("p");
          errorElement.className = "error-message text-sm text-red-600 mt-1";
          input.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = this.errors[field].join(", ");
      }
    });
  }

  // Limpiar errores del formulario
  clearErrors(form) {
    form.querySelectorAll(".error-message").forEach((el) => el.remove());
    form.querySelectorAll("input, select, textarea").forEach((input) => {
      input.classList.remove(
        "border-red-500",
        "focus:border-red-500",
        "focus:ring-red-500",
      );
      input.classList.add(
        "border-core-gray",
        "focus:border-core-primary",
        "focus:ring-core-primary",
      );
    });
  }
}

// Reglas de validación predefinidas
export const validationRules = {
  // Validaciones para empresas
  empresa: {
    rut: [
      { type: "required", message: "El RUT es obligatorio" },
      { type: "rutChileno", message: "El RUT no es válido" },
    ],
    razon_social: [
      { type: "required", message: "La razón social es obligatoria" },
      { type: "minLength", value: 3, message: "Mínimo 3 caracteres" },
    ],
    email: [{ type: "email", message: "El email no es válido" }],
    telefono: [
      {
        type: "pattern",
        value: "^\\+?\\d{9,12}$",
        message: "Formato de teléfono inválido",
      },
    ],
  },

  // Validaciones para productos
  producto: {
    codigo: [
      { type: "required", message: "El código es obligatorio" },
      { type: "minLength", value: 3, message: "Mínimo 3 caracteres" },
      { type: "maxLength", value: 50, message: "Máximo 50 caracteres" },
    ],
    nombre: [
      { type: "required", message: "El nombre es obligatorio" },
      { type: "minLength", value: 3, message: "Mínimo 3 caracteres" },
    ],
    tipo: [
      { type: "required", message: "El tipo es obligatorio" },
      {
        type: "enum",
        options: ["producto", "servicio"],
        message: "Tipo no válido",
      },
    ],
    precio_venta: [
      { type: "required", message: "El precio es obligatorio" },
      { type: "numeric", message: "Debe ser un número válido" },
      {
        type: "min",
        value: 0,
        message: "El precio debe ser mayor o igual a 0",
      },
    ],
    stock_actual: [
      { type: "numeric", message: "Debe ser un número válido" },
      { type: "min", value: 0, message: "El stock debe ser mayor o igual a 0" },
    ],
    categoria: [{ type: "required", message: "La categoría es obligatoria" }],
  },

  // Validaciones para planes
  plan: {
    nombre_plan: [
      { type: "required", message: "El nombre del plan es obligatorio" },
      { type: "minLength", value: 5, message: "Mínimo 5 caracteres" },
    ],
    tipo_plan: [
      { type: "required", message: "El tipo de plan es obligatorio" },
      {
        type: "enum",
        options: [
          "mensual",
          "trimestral",
          "semestral",
          "anual",
          "personalizado",
        ],
        message: "Tipo de plan no válido",
      },
    ],
    precio_base: [
      { type: "required", message: "El precio base es obligatorio" },
      { type: "numeric", message: "Debe ser un número válido" },
      { type: "min", value: 1000, message: "El precio mínimo es $1.000" },
    ],
    frecuencia_cobro: [
      { type: "required", message: "La frecuencia de cobro es obligatoria" },
      {
        type: "enum",
        options: ["mensual", "trimestral", "semestral", "anual", "único"],
        message: "Frecuencia no válida",
      },
    ],
    dia_cobro: [
      { type: "required", message: "El día de cobro es obligatorio" },
      { type: "numeric", message: "Debe ser un número válido" },
      { type: "min", value: 1, message: "El día debe estar entre 1 y 31" },
      { type: "max", value: 31, message: "El día debe estar entre 1 y 31" },
    ],
  },

  // Validaciones para contratos
  contrato: {
    cliente_rut: [
      { type: "required", message: "El RUT del cliente es obligatorio" },
      { type: "rutChileno", message: "El RUT no es válido" },
    ],
    cliente_nombre: [
      { type: "required", message: "El nombre del cliente es obligatorio" },
      { type: "minLength", value: 3, message: "Mínimo 3 caracteres" },
    ],
    cliente_email: [{ type: "email", message: "El email no es válido" }],
    monto_mensual: [
      { type: "required", message: "El monto mensual es obligatorio" },
      { type: "numeric", message: "Debe ser un número válido" },
      { type: "min", value: 0, message: "El monto debe ser mayor o igual a 0" },
    ],
    forma_pago: [
      { type: "required", message: "La forma de pago es obligatoria" },
      {
        type: "enum",
        options: ["transferencia", "tarjeta", "debito_automatico", "otro"],
        message: "Forma de pago no válida",
      },
    ],
    dia_pago: [
      { type: "required", message: "El día de pago es obligatorio" },
      { type: "numeric", message: "Debe ser un número válido" },
      { type: "min", value: 1, message: "El día debe estar entre 1 y 31" },
      { type: "max", value: 31, message: "El día debe estar entre 1 y 31" },
    ],
  },

  // Validaciones para usuarios/permisos
  usuario: {
    email: [
      { type: "required", message: "El email es obligatorio" },
      { type: "email", message: "El email no es válido" },
    ],
    tipo_acceso: [
      { type: "required", message: "El tipo de acceso es obligatorio" },
      {
        type: "enum",
        options: ["admin", "editor", "visualizador", "invitado"],
        message: "Tipo de acceso no válido",
      },
    ],
  },

  // Validaciones para invitaciones
  invitacion: {
    email_invitado: [
      { type: "required", message: "El email del invitado es obligatorio" },
      { type: "email", message: "El email no es válido" },
    ],
    nombre_invitado: [
      { type: "required", message: "El nombre del invitado es obligatorio" },
      { type: "minLength", value: 3, message: "Mínimo 3 caracteres" },
    ],
    tipo_acceso: [
      { type: "required", message: "El tipo de acceso es obligatorio" },
      {
        type: "enum",
        options: ["admin", "editor", "visualizador", "invitado"],
        message: "Tipo de acceso no válido",
      },
    ],
    fecha_expiracion: [
      { type: "required", message: "La fecha de expiración es obligatoria" },
      { type: "futureDate", message: "La fecha debe ser futura" },
    ],
  },

  // Validaciones para integraciones
  integracion: {
    tipo_servicio: [
      { type: "required", message: "El tipo de servicio es obligatorio" },
      {
        type: "enum",
        options: [
          "boletas_sii",
          "sii_empresas",
          "bci",
          "santander",
          "chile",
          "itau",
          "scotiabank",
          "bice",
          "otro",
        ],
        message: "Tipo de servicio no válido",
      },
    ],
    nombre_cuenta: [
      { type: "required", message: "El nombre de la cuenta es obligatorio" },
      { type: "minLength", value: 3, message: "Mínimo 3 caracteres" },
    ],
  },
};

// Exportar clases y utilidades
export { FormValidator };
