
# <center>Omegaverse</center>

## Descripción

Este addon está inspirado en el género literario del omegaverse y sus reglas base, por ahora sigue en desarrollo. 

![Omegaverse Icon](/RP/pack_icon.png)

> [!WARNING]
> Este ícono es totalmente temporal y no se va a usar en el producto final

> [!NOTE]
> Cuando se vaya a cambiar el ícono hay que tener las siguientes consideraciones
> El ícono debe acabar en la extensión **.png**
> El ícono debe ser cuadrado
> La idea principal del ícono es:
> La letra griega Omega en mayúscula siendo encerrada por la letra Alfa del mismo alfabeto
> La persona que quiera dibujarlo tiene libertad creativa para cualquier cosa que quiera agregar

## Testing con la API de GameTest

Para realizar el testing de este addon se necesita activar el módulo:
```json
{
    "module_name": "@minecraft/server-gametest",
    "version": "1.0.0-beta"
}
```
Dentro de el objeto dependencies en el archivo [manifest.json](/BP/manifest.json)
Como se presenta en la siguiente imagen:

```json
{
	"format_version": "1.20.80",
	"minecraft:item": {
		"description": {
			"identifier": "omegaverse_z:admin_key",
			"menu_category": {
				"category": "none" //--> Cambiar esto a "equipment" para manual testing
			}
		},
		"components": {
			"minecraft:icon": "omegaverse_z_admin_key",
			"minecraft:can_destroy_in_creative": {
				"value": false
			},
			"minecraft:hand_equipped": {
				"value": true
			},
			"minecraft:hover_text_color": "minecoin_gold"
		}
	}
}
```

Después de añadir este módulo solo hay que cambiar la propiedad **env.PROD** por **env.DEV** en el archivo [env.ts](/BP/scripts/core/constants/env.ts) en la variable currentContext
De la siguiente manera:

```ts
enum env {
    PROD = "production",
    DEV = "development"
}

const currentContext = env.PROD // --> Se cambia a env.DEV

export {
    env,
    currentContext
}
```

> [!NOTE]
> La variable currentContext es la que define en qué contexto está nuestro addon
> **PROD** : Para cuando nuestro addon va a ser usado para todo público
> **DEV** : Para cuando nuestro addon está siendo desarrollado, así podemos ver mensajes de lo que sucede al ejecutar ciertas acciones

> [!IMPORTANT]
> Cuando se va a imprimir un mensaje haciendo uso de **console.warn()** es necesario incluir dos datos separados por punto y coma *( ; )*:
> El mensaje que imprimirá nuestro console.warn()
> El archivo donde se está ejecutando
> Esto para evitar tener que buscar dónde se ejecutan los console.warn()

Todos los console.warn() tienen que estar precedidos de la siguiente condición:

```ts
if(currentContext === env.DEV) console.warn("mensaje; scripts/archivo.ts")
```

## Testing Manual

Y para testear diferentes funcionalidades manualmente primero hay que habilitar el objeto especial admin_key en el archivo [admin_key.json](/BP/items/admin_key.json):

![Imagen para habilitar el admin_key](https://i.pinimg.com/1200x/70/c6/63/70c6636aba938c5dd8ac4544f0770143.jpg)

De esta manera se puede acceder a él desde **CREATIVO** o desde el siguiente comando:
```
give @s omegaverse_z:admin_key 
```

> [!IMPORTANT]
> Una vez se haya obtenido este objeto al inventario, volver el archivo [admin_key.json](/BP/items/admin_key.json) a su estado original.

## Mecánicas

### Mundo

#### Eventos

Los eventos del mundo están definidos en su mayoría en el [index.ts](/BP/scripts/index.ts)

Pero algunos también en el [RuntimeEvents.ts](/BP/scripts/core/events/RuntimeEvents.ts) especificamente en el método **setWorldEvents()**. 
Para los eventos que no estén definidos como el cambio de día.

* El objeto [RuntimeEvents](/BP/scripts/core/events/) define cuándo se activan los eventos
* Y el objeto [RuntimeController](/BP/scripts/core/controllers/Runtime.ts) define cómo van a comportarse estos eventos.

### Jugadores

Sin implementar a la documentación

### Sistema de puntos

Sin implementar a la documentación

## Herramientas

### Lenguajes
* Typescript
* JSON structures

### Entorno de ejecución
* Deno

### Plataformas
* Bridge
* Minecraft Bedrock

### APIS
* @minecraft/server API
* @minecraft/server-ui API
* @minecraft/server-gametest API