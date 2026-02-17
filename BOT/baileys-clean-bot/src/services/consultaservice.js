import { db } from '../db.js'

//==============================================//
//   Crear nueva consultaretorna el ID creado   //
//==============================================//

export const crearConsulta = async (numero, nombre = null) => {
  const [result] = await db.execute(
    'INSERT INTO consultas (numero, nombre) VALUES (?, ?)',
    [numero, nombre]
  )

  return result.insertId
}

//==============================================//
//     Guardar mensaje dentro de un ticket      //
//==============================================//

export const guardarMensaje = async (consultaId, mensaje) => {
  await db.execute(
    'INSERT INTO ticket (consulta_id, mensaje) VALUES (?, ?)',
    [consultaId, mensaje]
  )
}

//==============================================//
//               CERRAR CONSULTA                //
//==============================================//

export const cerrarConsulta = async (consultaId) => {
  await db.execute(
    "UPDATE consultas SET estado = 'cerrada' WHERE id = ?",
    [consultaId]
  )
}