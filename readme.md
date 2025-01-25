
# <center>Omegaverse</center>

## Descripción

Este addon está inspirado en el género literario del omegaverse y sus reglas base, por ahora sigue en desarrollo

![Omegaverse Icon](/RP/pack_icon.png)

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

![Imagen del módulo](https://i.pinimg.com/736x/7d/88/64/7d886466d713e952fa9d14a0606e7f5d.jpg)

Después de añadir este módulo solo hay que cambiar la propiedad **env.PROD** por **env.DEV** en el archivo [index.ts](/BP/scripts/index.ts)
En la siguiente imagen se presenta cómo se tiene que ver en producción:

![Imagen del código en producción](https://i.pinimg.com/736x/39/54/21/395421abbe170413c4bd7d0b5d793785.jpg)

Y en la próxima se muestra cómo se ve en desarrollo:

![Imagen del código en desarrollo](https://i.pinimg.com/736x/0c/1c/9f/0c1c9f92986deb017e7b5380214794ed.jpg)

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

- [x] Al iniciar el mundo se inicializan 4 scoreboards
- [x] Cada vez que un día pase se va a ejecutar un evento en el runtime

### Jugadores

- [x] Cuando un jugador sube un punto de habilidad la habilidad se coloca automaticamente
- [ ] Cada que el jugador intente quitarse los efectos, los efectos de habilidad se volverán a colocar
    - Por morir
    - Por tomar leche
- [ ] Cuando un Omega en celo está cerca de un Alfa se activan buffos para este
    - Regeneración
    - Respiracion bajo el agua
- [ ] Los alfas pueden vincular a los omega por medio de un arma que deja una mordida
- [ ] Los alfa pueden evitar la mordida haciendo un collar que se pone en la parte de la cabeza

### Sistema de puntos

Sin implementar

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