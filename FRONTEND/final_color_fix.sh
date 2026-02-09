#!/bin/bash

# Define the target directory
TARGET_DIR="/Users/owis/dev/core/FRONTEND/src"

# Function to replace colors in a file
replace_colors() {
    local file="$1"
    echo "Processing $file"
    
    # --- Backgrounds ---
    # Light grays
    sed -i '' 's/bg-gray-50/bg-core-light/g' "$file"
    sed -i '' 's/bg-gray-100/bg-core-gray\/10/g' "$file"
    sed -i '' 's/bg-gray-200/bg-core-gray\/30/g' "$file" # Use 30% opacity for 200 to keep it subtle
    sed -i '' 's/bg-gray-300/bg-core-gray\/50/g' "$file"
    
    # Dark grays
    sed -i '' 's/bg-gray-800/bg-core-dark/g' "$file"
    sed -i '' 's/bg-gray-900/bg-core-dark/g' "$file"
    sed -i '' 's/bg-slate-900/bg-core-dark/g' "$file"
    sed -i '' 's/bg-neutral-800/bg-neutral-800/g' "$file" # Keep neutral for dark mode specific if needed, or map to core-dark
    # Mapping neutral-900 to core-dark for consistency if used as main dark bg
    # sed -i '' 's/bg-neutral-900/bg-core-dark/g' "$file" 
    
    # Primary (Lime -> Core Primary)
    sed -i '' 's/bg-lime-500/bg-core-primary/g' "$file"
    sed -i '' 's/bg-lime-600/bg-core-primary/g' "$file"
    sed -i '' 's/bg-blue-600/bg-core-primary/g' "$file" # Map blue to primary as well for consistency
    
    # --- Text ---
    sed -i '' 's/text-gray-900/text-core-dark/g' "$file"
    sed -i '' 's/text-gray-800/text-core-dark/g' "$file"
    sed -i '' 's/text-gray-700/text-core-dark\/80/g' "$file"
    sed -i '' 's/text-gray-600/text-core-dark\/60/g' "$file"
    sed -i '' 's/text-gray-500/text-core-gray/g' "$file" # core-gray is C6C6C6, which is light. gray-500 is medium.
    # Maybe text-core-dark/50 is better for gray-500? C6C6C6 might be too light for text on white.
    # Let's check: C6C6C6 is light gray. On white it has low contrast.
    # core-dark is 131313. core-dark/60 is roughly gray-600.
    # core-dark/40 might be better for gray-500.
    # Let's use text-core-dark/60 for gray-500/600 for now to ensure readability.
    sed -i '' 's/text-gray-500/text-core-dark\/60/g' "$file"
    
    sed -i '' 's/text-lime-500/text-core-primary/g' "$file"
    sed -i '' 's/text-lime-600/text-core-primary/g' "$file"
    sed -i '' 's/text-blue-600/text-core-primary/g' "$file"
    
    # --- Borders ---
    sed -i '' 's/border-gray-200/border-core-gray\/30/g' "$file"
    sed -i '' 's/border-gray-300/border-core-gray\/50/g' "$file"
    sed -i '' 's/border-gray-700/border-core-gray\/20/g' "$file" # Dark mode borders usually
    
    sed -i '' 's/border-lime-500/border-core-primary/g' "$file"
    
    # --- Additional Stone/Zinc/Slate Mappings ---
    # Stone
    sed -i '' 's/bg-stone-50/bg-core-light/g' "$file"
    sed -i '' 's/bg-stone-100/bg-core-gray\/10/g' "$file"
    sed -i '' 's/bg-stone-200/bg-core-gray\/30/g' "$file"
    sed -i '' 's/text-stone-500/text-core-dark\/60/g' "$file"
    sed -i '' 's/text-stone-600/text-core-dark\/80/g' "$file"
    sed -i '' 's/border-stone-200/border-core-gray\/30/g' "$file"

    # Zinc
    sed -i '' 's/bg-zinc-50/bg-core-light/g' "$file"
    sed -i '' 's/text-zinc-500/text-core-dark\/60/g' "$file"
    sed -i '' 's/border-zinc-200/border-core-gray\/30/g' "$file"

    # Slate
    sed -i '' 's/bg-slate-50/bg-core-light/g' "$file"
    sed -i '' 's/bg-slate-100/bg-core-gray\/10/g' "$file"
    sed -i '' 's/text-slate-500/text-core-dark\/60/g' "$file"
    sed -i '' 's/text-slate-600/text-core-dark\/80/g' "$file"
    sed -i '' 's/text-slate-700/text-core-dark/g' "$file"
    sed -i '' 's/border-slate-200/border-core-gray\/30/g' "$file"
    
    # Neutral (Dark mode text adjustments)
    # text-neutral-400 is often used for secondary text in dark mode. Map to text-core-gray (#C6C6C6)
    sed -i '' 's/text-neutral-400/text-core-gray/g' "$file"
    
    # --- Hovers ---
    # Buttons (assuming primary background)
    sed -i '' 's/hover:bg-lime-600/hover:opacity-80/g' "$file"
    sed -i '' 's/hover:bg-blue-700/hover:opacity-80/g' "$file"
    
    # --- Fills/Strokes ---
    sed -i '' 's/fill-blue-600/fill-core-primary/g' "$file"
    sed -i '' 's/text-blue-600/text-core-primary/g' "$file"
}

# Export function to be used by find -exec (not strictly needed with loop)
export -f replace_colors

# Find and process files
find "$TARGET_DIR" -type f \( -name "*.astro" -o -name "*.jsx" -o -name "*.tsx" \) | while read -r file; do
    replace_colors "$file"
done

echo "Color replacement complete."
