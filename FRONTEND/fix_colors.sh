#!/bin/bash

# Function to process a file
process_file() {
    local FILE="$1"
    echo "Processing $FILE"

    # Gray Backgrounds
    sed -i '' 's/bg-gray-50/bg-core-light/g' "$FILE"
    sed -i '' 's/bg-gray-100/bg-core-gray\/10/g' "$FILE"
    sed -i '' 's/bg-gray-200/bg-core-gray/g' "$FILE"
    sed -i '' 's/bg-gray-800/bg-core-dark/g' "$FILE"
    sed -i '' 's/bg-gray-900/bg-core-dark/g' "$FILE"

    # Text Grays
    sed -i '' 's/text-gray-400/text-core-gray/g' "$FILE"
    sed -i '' 's/text-gray-500/text-core-gray/g' "$FILE"
    sed -i '' 's/text-gray-600/text-core-dark/g' "$FILE"
    sed -i '' 's/text-gray-700/text-core-dark/g' "$FILE"
    sed -i '' 's/text-gray-800/text-core-dark/g' "$FILE"
    sed -i '' 's/text-gray-900/text-core-dark/g' "$FILE"

    # Borders
    sed -i '' 's/border-gray-100/border-core-gray\/20/g' "$FILE"
    sed -i '' 's/border-gray-200/border-core-gray/g' "$FILE"
    sed -i '' 's/border-gray-300/border-core-gray/g' "$FILE"

    # Semantic/Brand Colors
    sed -i '' 's/bg-lime-500/bg-core-primary/g' "$FILE"
    sed -i '' 's/bg-lime-100/bg-core-primary\/20/g' "$FILE"
    sed -i '' 's/text-lime-800/text-core-dark/g' "$FILE"
    sed -i '' 's/text-lime-500/text-core-primary/g' "$FILE"
    sed -i '' 's/focus:border-lime-500/focus:border-core-primary/g' "$FILE"
    sed -i '' 's/focus:ring-lime-500/focus:ring-core-primary/g' "$FILE"
    sed -i '' 's/hover:bg-lime-600/hover:opacity-80/g' "$FILE"

    sed -i '' 's/bg-blue-600/bg-core-primary/g' "$FILE"
    sed -i '' 's/text-blue-600/text-core-primary/g' "$FILE"
    sed -i '' 's/hover:bg-blue-700/hover:opacity-80/g' "$FILE"
    sed -i '' 's/bg-green-500/bg-core-primary/g' "$FILE"

    # Hovers
    sed -i '' 's/hover:bg-gray-50/hover:bg-core-gray\/10/g' "$FILE"
    sed -i '' 's/hover:bg-gray-100/hover:bg-core-gray\/10/g' "$FILE"
}

export -f process_file

# Find and process files
find src/pages/empresa -name "*.astro" -exec bash -c 'process_file "$0"' {} \;
find src/components/ui -name "*.astro" -exec bash -c 'process_file "$0"' {} \;
find src/components -name "*.jsx" -not -path "*/old-dashboard/*" -exec bash -c 'process_file "$0"' {} \;
