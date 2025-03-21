import { system, world } from '@minecraft/server'
import { runtime } from "./core/runtime"
import PlayerEvents from "./core/events/PlayerEvents"
import WorldEvents from './core/events/WorldEvents'
import { MinecraftBlockIds } from './core/constants/block_ids'
import { currentContext, env } from './core/constants/env'

if (currentContext === env.DEV) console.warn("Loading index.ts; scripts/index.ts")

world.afterEvents.itemUse.subscribe((e) => PlayerEvents.afterUseAdminKey(e))

world.afterEvents.playerBreakBlock.subscribe((e) => PlayerEvents.afterBrakeAMobSpawn(e), { blockTypes: [MinecraftBlockIds.MobSpawner] })

// TODO: Crear el mob de Alfa
// Al matar un Alfa debería dar puntos de AlfaKillerPoints

world.afterEvents.worldInitialize.subscribe(() => WorldEvents.onWorldInitialize())

world.afterEvents.playerSpawn.subscribe(e => console.warn(e.player.nameTag))

world.afterEvents.itemCompleteUse.subscribe(e => PlayerEvents.afterItemCompleteUse(e))

world.afterEvents.itemReleaseUse.subscribe(e => PlayerEvents.afterItemReleaseUse(e))

world.afterEvents.playerSpawn.subscribe(e => PlayerEvents.afterPlayerSpawnEvent(e))

world.afterEvents.entityHitEntity.subscribe(e => PlayerEvents.afterEntityHitEntity(e))

world.afterEvents.entityDie.subscribe(e => PlayerEvents.afterEntityDie(e))

//El script que se va a ejecutar por tick
system.run(function runnable() {
    system.run(runnable)
    runtime()
})

//Si el addon está en desarrollo registrar todos los test
if (currentContext === env.DEV) import("./core/gametests/GametestCreator").then(pack => pack.default.registerAllTests())

//TODO:

//Arreglar el sistema de puntos de minado : core/util/MathFunctions.ts ; core/controllers/PlayerController

//Hacer gametest para cada funcionalidad