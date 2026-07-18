pnpm build
## Get Azure SWA deployment token
$DEPLOYMENT_TOKEN = az staticwebapp secrets list --name static-web-editor --resource-group rg-365evergreen-website --query "properties.apiKey" -o tsv;
## Deploy to Azure
Write-Host "Deploying to Azure Static Web Apps..."
swa deploy ./dist --deployment-token $DEPLOYMENT_TOKEN --env production