{
   "$schema":"http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion":"1.0.0.0",
   "parameters":{
      "siteName":{
         "type":"string",
         "metadata":{
            "description":"The name of the function app that you wish to create."
         }
      }
   },
   "variables":{
      "storageName":"[concat('function', uniqueString(parameters('siteName')))]",
      "contentShareName":"[toLower(parameters('siteName'))]",
      "repoUrl":"",
      "branch":"master"
   },
   "resources":[
      {
         "apiVersion":"2016-03-01",
         "name":"[parameters('siteName')]",
         "type":"Microsoft.Web/sites",
         "properties":{
            "name":"[parameters('siteName')]",
            "siteConfig":{
               "appSettings":[
                  {
                     "name":"AzureWebJobsDashboard",
                     "value":"[concat('DefaultEndpointsProtocol=https;AccountName=',variables('storageName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageName')), '2015-05-01-preview').key1)]"
                  },
                  {
                     "name":"AzureWebJobsStorage",
                     "value":"[concat('DefaultEndpointsProtocol=https;AccountName=',variables('storageName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageName')), '2015-05-01-preview').key1)]"
                  },
                  {
                     "name":"WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
                     "value":"[concat('DefaultEndpointsProtocol=https;AccountName=',variables('storageName'),';AccountKey=',listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageName')), '2015-05-01-preview').key1)]"
                  },
                  {
                     "name":"FUNCTIONS_EXTENSION_VERSION",
                     "value":"~1"
                  },
                  {
                     "name":"ROUTING_EXTENSION_VERSION",
                     "value":"~0.1"
                  },
                  {
                     "name":"WEBSITE_CONTENTSHARE",
                     "value":"[variables('contentShareName')]"
                  }
               ]
            },
            "clientAffinityEnabled":false
         },
         "resources":[
            {
               "apiVersion":"2015-08-01",
               "name":"web",
               "type":"sourcecontrols",
               "dependsOn":[
                  "[resourceId('Microsoft.Web/Sites', parameters('siteName'))]"
               ],
               "properties":{
                  "RepoUrl":"[variables('repoURL')]",
                  "branch":"[variables('branch')]",
                  "IsManualIntegration":true
               }
            }
         ],
         "dependsOn":[
            "[resourceId('Microsoft.Storage/storageAccounts', variables('storageName'))]"
         ],
         "location":"[resourceGroup().location]",
         "kind":"functionapp"
      },
      {
         "apiVersion":"2015-05-01-preview",
         "type":"Microsoft.Storage/storageAccounts",
         "name":"[variables('storageName')]",
         "location":"[resourceGroup().location]",
         "properties":{
            "accountType":"Standard_LRS"
         }
      }
   ],
   "outputs":{
      "siteUri":{
         "type":"string",
         "value":"[concat('https://',reference(resourceId('Microsoft.Web/sites', parameters('siteName'))).hostNames[0])]"
      }
   }
}