#!/bin/bash

# Define Core Colors
CORE_PRIMARY="bg-core-primary"
CORE_LIGHT="bg-core-light"
CORE_GRAY="bg-core-gray"
CORE_DARK="bg-core-dark"

# Function to replace in file
replace_in_file() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "Processing $file..."
        
        # Replace bg-white with bg-core-light (class only)
        sed -i '' 's/bg-white/bg-core-light/g' "$file"
        
        # Replace hover:bg-core-gray/10 with hover:bg-core-gray/10 hover:opacity-80
        # Check if hover:opacity-80 is already there to avoid duplication
        if ! grep -q "hover:opacity-80" "$file"; then
             sed -i '' 's/hover:bg-/hover:opacity-80 hover:bg-/g' "$file"
        fi

        # Specific fixes for text-gray if any left (based on earlier grep, mostly cleaned but good to be safe)
        sed -i '' 's/text-gray-900/text-core-dark/g' "$file"
        sed -i '' 's/text-gray-800/text-core-dark/g' "$file"
        sed -i '' 's/text-gray-500/text-core-dark\/60/g' "$file"
    else
        echo "File $file not found"
    fi
}

# Target specific files found in grep
replace_in_file "FRONTEND/src/components/maestros/Client.jsx"
replace_in_file "FRONTEND/src/components/qr/scanner.tsx"
replace_in_file "FRONTEND/src/components/UserPop.jsx"
replace_in_file "FRONTEND/src/layouts/MainLayout.jsx"
replace_in_file "FRONTEND/src/components/old-dashboard/Resumenes.jsx"
replace_in_file "FRONTEND/src/components/old-dashboard/CreditCards.jsx"
replace_in_file "FRONTEND/src/components/old-dashboard/ContributionGraph.tsx"
replace_in_file "FRONTEND/src/components/old-dashboard/FinancialChart.tsx"
replace_in_file "FRONTEND/src/components/old-dashboard/Daily.jsx"
replace_in_file "FRONTEND/src/components/old-dashboard/VentasModulo.jsx"
replace_in_file "FRONTEND/src/components/old-dashboard/Services.jsx"

echo "Final cleanup completed."
