/**
 * Танки для кейсов.
 * nation, class, personalMissionCategory (1|2|3 или null)
 */

export const tanks = [
  // ЛБЗ Категория 1
  { id: "t1", name: "Объект 279 (р)", nation: "ussr", class: "ht", personalMissionCategory: 1, rarity: "legendary", chance: 2, image: "/images/tanks/obj279.png", isGuaranteed: true, description: "ЛБЗ Кат.1", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "obj279" },
  { id: "t2", name: "T95E6", nation: "usa", class: "mt", personalMissionCategory: 1, rarity: "legendary", chance: 2, image: "/images/tanks/t95e6.png", isGuaranteed: true, description: "ЛБЗ Кат.1", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t95e6" },
  { id: "t3", name: "VK 72.01 (K)", nation: "germany", class: "ht", personalMissionCategory: 1, rarity: "legendary", chance: 2, image: "/images/tanks/vk7201.png", isGuaranteed: true, description: "ЛБЗ Кат.1", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "vk7201" },
  // ЛБЗ Категория 2
  { id: "t4", name: "Object 260", nation: "ussr", class: "mt", personalMissionCategory: 2, rarity: "legendary", chance: 2, image: "/images/tanks/obj260.png", isGuaranteed: true, description: "ЛБЗ Кат.2", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "obj260" },
  { id: "t5", name: "M60", nation: "usa", class: "mt", personalMissionCategory: 2, rarity: "legendary", chance: 2, image: "/images/tanks/m60.png", isGuaranteed: true, description: "ЛБЗ Кат.2", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "m60" },
  { id: "t6", name: "Е 50 Ausf. M", nation: "germany", class: "mt", personalMissionCategory: 2, rarity: "legendary", chance: 2, image: "/images/tanks/e50m.png", isGuaranteed: true, description: "ЛБЗ Кат.2", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "e50m" },
  // ЛБЗ Категория 3
  { id: "t7", name: "Object 907", nation: "ussr", class: "mt", personalMissionCategory: 3, rarity: "legendary", chance: 2, image: "/images/tanks/obj907.png", isGuaranteed: true, description: "ЛБЗ Кат.3", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "obj907" },
  { id: "t8", name: "T22 medium", nation: "ussr", class: "mt", personalMissionCategory: 3, rarity: "legendary", chance: 2, image: "/images/tanks/t22.png", isGuaranteed: true, description: "ЛБЗ Кат.3", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t22" },
  { id: "t9", name: "Chieftain/T95", nation: "uk", class: "ht", personalMissionCategory: 3, rarity: "legendary", chance: 2, image: "/images/tanks/chieftain.png", isGuaranteed: true, description: "ЛБЗ Кат.3", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "chieftain" },
  // USSR
  { id: "t10", name: "Т-62А", nation: "ussr", class: "mt", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/t62a.png", isGuaranteed: false, description: "СССР", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "t62a" },
  { id: "t11", name: "ИС-7", nation: "ussr", class: "ht", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/is7.png", isGuaranteed: false, description: "СССР", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "is7" },
  { id: "t12", name: "Объект 268", nation: "ussr", class: "td", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/obj268.png", isGuaranteed: false, description: "СССР", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "obj268" },
  // USA
  { id: "t13", name: "M48 Patton", nation: "usa", class: "mt", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/m48.png", isGuaranteed: false, description: "США", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "m48" },
  { id: "t14", name: "T110E5", nation: "usa", class: "ht", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/t110e5.png", isGuaranteed: false, description: "США", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "t110e5" },
  { id: "t15", name: "T110E4", nation: "usa", class: "td", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/t110e4.png", isGuaranteed: false, description: "США", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "t110e4" },
  // Germany
  { id: "t16", name: "Leopard 1", nation: "germany", class: "mt", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/leopard1.png", isGuaranteed: false, description: "Германия", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "leopard1" },
  { id: "t17", name: "Maus", nation: "germany", class: "ht", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/maus.png", isGuaranteed: false, description: "Германия", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "maus" },
  { id: "t18", name: "Grille 15", nation: "germany", class: "td", personalMissionCategory: null, rarity: "epic", chance: 5, image: "/images/tanks/grille15.png", isGuaranteed: false, description: "Германия", sound: "/sounds/epic.mp3", hasParticles: false, backendId: "grille15" },
];

/** Общие ресурсы для всех кейсов */
export const commonResources = [
  { id: "r1", name: "250 000 кредитов", type: "credits", rarity: "common", chance: 25, image: "/images/250k.png", isGuaranteed: false, description: "Кредиты", sound: "/sounds/common.mp3", hasParticles: false, color: null, backendId: "credits250" },
  { id: "r2", name: "500 000 кредитов", type: "credits", rarity: "common", chance: 20, image: "/images/500k.png", isGuaranteed: false, description: "Кредиты", sound: "/sounds/common.mp3", hasParticles: false, color: null, backendId: "credits500" },
  { id: "r3", name: "50 бон", type: "bonds", rarity: "rare", chance: 15, image: "/images/50bonds.png", isGuaranteed: false, description: "Боны", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "bonds50" },
  { id: "r4", name: "3 билета в арсенал", type: "tickets", rarity: "rare", chance: 12, image: "/images/tickets.png", isGuaranteed: false, description: "Билеты", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "tickets3" },
  { id: "r5", name: "Премиум 3 дня", type: "premium", rarity: "rare", chance: 10, image: "/images/premium3.png", isGuaranteed: false, description: "Премиум", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "premium3" },
];
