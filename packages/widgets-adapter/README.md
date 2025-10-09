# widget-to-endpoints-adapter

Nécessaire au fonctionnement du composant web [widgets-wrapper](https://github.com/GIP-RECIA/recia-ui/tree/main/packages/webcomponents/widgets-wrapper).

## Ajout d'un widget

1. Ajouter une entrée à l'enum [WidgetKey](./src/types/widgetTypes.ts).
2. Déclarer un nouveau service pour dans `./src/services`.

   ```ts
   async function get(
     url: string,
     timeout: number,
   ): Promise<XxxApiResponse> {
     try {
       const response = await fetch(url, {
         method: 'GET',
         signal: AbortSignal.timeout(timeout),
       })

       if (!response.ok)
         throw new Error(response.statusText)

       return await response.json()
     }
     catch (error) {
       console.error(error, url)
       throw error
     }
   }

   function getItems(
     config: Config,
   ): WidgetItem[] {
     return []
   }

   async function getXxxWidget(
     config: Config,
   ): Promise<Partial<Widget>> {
     const response = await get(
       config.xxx.xxx,
       config.global.timeout,
     )
     if (!response)
       return {}

     const items = getItems(
       config
     )

     return {
       items,
     }
   }

   export {
     getXxxWidget,
   }
   ```

3. Ajouter une entrée dans [widgetHandlers](./src/widgetAdapter.ts) qui pointe vers le service.
