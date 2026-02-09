#!/bin/bash

# Polish clientes.astro
sed -i '' 's/bg-white/bg-core-light/g' /Users/owis/dev/core/FRONTEND/src/pages/empresa/clientes.astro
sed -i '' 's/dark:border-neutral-700/dark:border-core-gray\/20/g' /Users/owis/dev/core/FRONTEND/src/pages/empresa/clientes.astro

# Polish invitation.astro
sed -i '' 's/dark:bg-neutral-800/dark:bg-core-dark/g' /Users/owis/dev/core/FRONTEND/src/pages/empresa/invitation/invitation.astro
sed -i '' 's/dark:border-neutral-700/dark:border-core-gray\/20/g' /Users/owis/dev/core/FRONTEND/src/pages/empresa/invitation/invitation.astro

# Polish CompanyFormComponent.astro
sed -i '' 's/dark:bg-neutral-800/dark:bg-core-dark/g' /Users/owis/dev/core/FRONTEND/src/pages/empresa/company/CompanyFormComponent.astro
sed -i '' 's/dark:border-neutral-700/dark:border-core-gray\/20/g' /Users/owis/dev/core/FRONTEND/src/pages/empresa/company/CompanyFormComponent.astro

# Polish CompanyForm.astro (just in case)
sed -i '' 's/dark:bg-neutral-800/dark:bg-core-dark/g' /Users/owis/dev/core/FRONTEND/src/pages/empresa/company/CompanyForm.astro
sed -i '' 's/dark:border-neutral-700/dark:border-core-gray\/20/g' /Users/owis/dev/core/FRONTEND/src/pages/empresa/company/CompanyForm.astro
