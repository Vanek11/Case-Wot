/**
 * Танки для кейсов.
 * Названия — исследуемая техника 10 уровня по Танковедению tanki.su:
 * https://tanki.su/ru/tankopedia/#mt&w_m=tanks&w_l=10&w_research=1
 * nation, class, personalMissionCategory (1|2|3 для ЛБЗ 1.0/2.0/3.0 или null)
 * unlockRequires: для спецкейсов ЛБЗ — "armt" | "tf2clark" | null (ARMT без требования)
 */

export const tanks = [
  // --- ЛБЗ 1.0 ---
  { id: "t1", name: "Объект 279 (р)", nation: "ussr", class: "ht", personalMissionCategory: 1, rarity: "legendary", chance: 2, image: "/images/tanks/obj279.png", isGuaranteed: true, description: "ЛБЗ 1.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "obj279" },
  { id: "t2", name: "T95E6", nation: "usa", class: "mt", personalMissionCategory: 1, rarity: "legendary", chance: 2, image: "/images/tanks/t95e6.png", isGuaranteed: true, description: "ЛБЗ 1.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t95e6" },
  { id: "t3", name: "VK 72.01 (K)", nation: "germany", class: "ht", personalMissionCategory: 1, rarity: "legendary", chance: 2, image: "/images/tanks/vk7201.png", isGuaranteed: true, description: "ЛБЗ 1.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "vk7201" },
  // --- ЛБЗ 2.0 ---
  { id: "t4", name: "Object 260", nation: "ussr", class: "mt", personalMissionCategory: 2, rarity: "legendary", chance: 2, image: "/images/tanks/obj260.png", isGuaranteed: true, description: "ЛБЗ 2.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "obj260" },
  { id: "t5", name: "M60", nation: "usa", class: "mt", personalMissionCategory: 2, rarity: "legendary", chance: 2, image: "/images/tanks/m60.png", isGuaranteed: true, description: "ЛБЗ 2.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "m60" },
  { id: "t6", name: "Е 50 Ausf. M", nation: "germany", class: "mt", personalMissionCategory: 2, rarity: "legendary", chance: 2, image: "/images/tanks/e50m.png", isGuaranteed: true, description: "ЛБЗ 2.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "e50m" },
  // --- ЛБЗ 3.0 ---
  { id: "t7", name: "Object 907", nation: "ussr", class: "mt", personalMissionCategory: 3, rarity: "legendary", chance: 2, image: "/images/tanks/obj907.png", isGuaranteed: true, description: "ЛБЗ 3.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "obj907" },
  { id: "t8", name: "T22 medium", nation: "ussr", class: "mt", personalMissionCategory: 3, rarity: "legendary", chance: 2, image: "/images/tanks/t22.png", isGuaranteed: true, description: "ЛБЗ 3.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t22" },
  { id: "t9", name: "Chieftain/T95", nation: "uk", class: "ht", personalMissionCategory: 3, rarity: "legendary", chance: 2, image: "/images/tanks/chieftain.png", isGuaranteed: true, description: "ЛБЗ 3.0", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "chieftain" },
  // --- Спецкейсы ЛБЗ (последовательное открытие: ARMT → TF-2 Clark → Project Murat) ---
  { id: "t_armt", name: "ARMT", nation: "ussr", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/armt.png", isGuaranteed: true, description: "ЛБЗ", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "armt", unlockRequires: null },
  { id: "t_tf2clark", name: "TF-2 Clark", nation: "usa", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/tf2clark.png", isGuaranteed: true, description: "ЛБЗ", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "tf2clark", unlockRequires: "armt" },
  { id: "t_murat", name: "Project Murat", nation: "germany", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/murat.png", isGuaranteed: true, description: "ЛБЗ", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "projectmurat", unlockRequires: "tf2clark" },
  // --- СССР (танки 10 ур. — легендарный главный приз в прокачке/сбросе) ---
  { id: "t10", name: "Т-62А", nation: "ussr", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/t62a.png", isGuaranteed: true, description: "СССР", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t62a" },
  { id: "t11", name: "ИС-7", nation: "ussr", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/is7.png", isGuaranteed: true, description: "СССР", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "is7" },
  { id: "t12", name: "Объект 268", nation: "ussr", class: "td", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/obj268.png", isGuaranteed: true, description: "СССР", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "obj268" },
  { id: "t_ussr_lt", name: "Т-100 ЛТ", nation: "ussr", class: "lt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/t100lt.png", isGuaranteed: true, description: "СССР", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t100lt" },
  { id: "t_ussr_spg", name: "Объект 261", nation: "ussr", class: "spg", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/obj261.png", isGuaranteed: true, description: "СССР", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "obj261" },
  // --- США ---
  { id: "t13", name: "M48 Patton", nation: "usa", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/m48.png", isGuaranteed: true, description: "США", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "m48" },
  { id: "t14", name: "T110E5", nation: "usa", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/t110e5.png", isGuaranteed: true, description: "США", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t110e5" },
  { id: "t15", name: "T110E4", nation: "usa", class: "td", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/t110e4.png", isGuaranteed: true, description: "США", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t110e4" },
  { id: "t_usa_lt", name: "XM551 Sheridan", nation: "usa", class: "lt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/sheridan.png", isGuaranteed: true, description: "США", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "sheridan" },
  { id: "t_usa_spg", name: "T92 HMC", nation: "usa", class: "spg", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/t92.png", isGuaranteed: true, description: "США", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "t92" },
  // --- Германия ---
  { id: "t16", name: "Leopard 1", nation: "germany", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/leopard1.png", isGuaranteed: true, description: "Германия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "leopard1" },
  { id: "t17", name: "Maus", nation: "germany", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/maus.png", isGuaranteed: true, description: "Германия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "maus" },
  { id: "t18", name: "Grille 15", nation: "germany", class: "td", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/grille15.png", isGuaranteed: true, description: "Германия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "grille15" },
  { id: "t_ger_lt", name: "Rheinmetall Panzerwagen", nation: "germany", class: "lt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/rhm.png", isGuaranteed: true, description: "Германия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "rhm" },
  { id: "t_ger_spg", name: "G.W. E 100", nation: "germany", class: "spg", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/gwe100.png", isGuaranteed: true, description: "Германия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "gwe100" },
  // --- Великобритания ---
  { id: "t_uk_1", name: "Super Conqueror", nation: "uk", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/sconq.png", isGuaranteed: true, description: "Великобритания", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "sconq" },
  { id: "t_uk_2", name: "Centurion AX", nation: "uk", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/centax.png", isGuaranteed: true, description: "Великобритания", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "centax" },
  { id: "t_uk_3", name: "FV4005", nation: "uk", class: "td", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/fv4005.png", isGuaranteed: true, description: "Великобритания", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "fv4005" },
  // --- Франция ---
  { id: "t_fr_1", name: "AMX 50 B", nation: "france", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/amx50b.png", isGuaranteed: true, description: "Франция", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "amx50b" },
  { id: "t_fr_2", name: "Bat.-Châtillon 25 t", nation: "france", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/bc25t.png", isGuaranteed: true, description: "Франция", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "bc25t" },
  { id: "t_fr_3", name: "Foch B", nation: "france", class: "td", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/fochb.png", isGuaranteed: true, description: "Франция", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "fochb" },
  // --- Чехословакия (только MT и HT — Škoda T 56 это 8 ур. премиум, не прокачиваемый) ---
  { id: "t_cz_1", name: "TVP T 50/51", nation: "czechoslovakia", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/tvp50.png", isGuaranteed: true, description: "Чехословакия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "tvp50" },
  { id: "t_cz_2", name: "Vz. 55", nation: "czechoslovakia", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/vz55.png", isGuaranteed: true, description: "Чехословакия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "vz55" },
  // --- Китай ---
  { id: "t_cn_1", name: "121", nation: "china", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/121.png", isGuaranteed: true, description: "Китай", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "121" },
  { id: "t_cn_2", name: "113", nation: "china", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/113.png", isGuaranteed: true, description: "Китай", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "113" },
  { id: "t_cn_3", name: "WZ-111 5A", nation: "china", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/wz111.png", isGuaranteed: true, description: "Китай", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "wz111" },
  // --- Япония ---
  { id: "t_jp_1", name: "STB-1", nation: "japan", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/stb1.png", isGuaranteed: true, description: "Япония", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "stb1" },
  { id: "t_jp_2", name: "Type 5 Heavy", nation: "japan", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/type5.png", isGuaranteed: true, description: "Япония", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "type5" },
  { id: "t_jp_3", name: "Type 71", nation: "japan", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/type71.png", isGuaranteed: true, description: "Япония", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "type71" },
  // --- Польша ---
  { id: "t_pl_1", name: "60TP Lewandowskiego", nation: "poland", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/60tp.png", isGuaranteed: true, description: "Польша", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "60tp" },
  { id: "t_pl_2", name: "CS-63", nation: "poland", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/cs63.png", isGuaranteed: true, description: "Польша", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "cs63" },
  { id: "t_pl_3", name: "WZ.70 ŻUBR", nation: "poland", class: "td", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/wz70zubr.png", isGuaranteed: true, description: "Польша", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "wz70zubr" },
  // --- Швеция ---
  { id: "t_sw_1", name: "Kranvagn", nation: "sweden", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/kranvagn.png", isGuaranteed: true, description: "Швеция", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "kranvagn" },
  { id: "t_sw_2", name: "UDES 15/16", nation: "sweden", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/udes1516.png", isGuaranteed: true, description: "Швеция", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "udes1516" },
  { id: "t_sw_3", name: "Strv 103B", nation: "sweden", class: "td", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/strv103b.png", isGuaranteed: true, description: "Швеция", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "strv103b" },
  // --- Италия ---
  { id: "t_it_1", name: "Rinoceronte", nation: "italy", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/rinoceronte.png", isGuaranteed: true, description: "Италия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "rinoceronte" },
  { id: "t_it_2", name: "Progetto 65", nation: "italy", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/progetto65.png", isGuaranteed: true, description: "Италия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "progetto65" },
  { id: "t_it_3", name: "Minotauro", nation: "italy", class: "td", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/minotauro.png", isGuaranteed: true, description: "Италия", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "minotauro" },
  // --- Сборная наций ---
  { id: "t_all_1", name: "Obj. 279 (р)", nation: "alliance", class: "ht", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/obj279.png", isGuaranteed: true, description: "Сборная наций", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "all_obj279" },
  { id: "t_all_2", name: "M60", nation: "alliance", class: "mt", personalMissionCategory: null, rarity: "legendary", chance: 2, image: "/images/tanks/m60.png", isGuaranteed: true, description: "Сборная наций", sound: "/sounds/legendary.mp3", hasParticles: true, backendId: "all_m60" },
];

/** Танки только для спецкейсов ЛБЗ (ARMT, TF-2 Clark, Project Murat) — не участвуют в кейсах по нации/классу/ЛБЗ 1–3 */
export const specialLbzTanks = tanks.filter((t) => t.unlockRequires !== undefined);

/** Общие ресурсы для кейсов прокачки и сброса. Ранги: эпик, редкий, простой. */
export const commonResources = [
  // Эпик: 1 млн кредитов, 200 бон, 20 билетов натиска, 100к свободного опыта
  { id: "r_epic_1", name: "1 000 000 кредитов", type: "credits", rarity: "epic", chance: 5, image: "/images/1m.png", isGuaranteed: false, description: "Кредиты", sound: "/sounds/epic.mp3", hasParticles: false, color: null, backendId: "credits1m" },
  { id: "r_epic_2", name: "200 бон", type: "bonds", rarity: "epic", chance: 5, image: "/images/200bonds.png", isGuaranteed: false, description: "Боны", sound: "/sounds/epic.mp3", hasParticles: false, color: null, backendId: "bonds200" },
  { id: "r_epic_3", name: "20 билетов натиска", type: "tickets", rarity: "epic", chance: 5, image: "/images/tickets20.png", isGuaranteed: false, description: "Билеты натиска", sound: "/sounds/epic.mp3", hasParticles: false, color: null, backendId: "tickets20" },
  { id: "r_epic_4", name: "100 000 свободного опыта", type: "freexp", rarity: "epic", chance: 5, image: "/images/freexp100k.png", isGuaranteed: false, description: "Свободный опыт", sound: "/sounds/epic.mp3", hasParticles: false, color: null, backendId: "freexp100k" },
  // Редкий: 250к, 500к кредитов, 150 бон, 100 бон, 10 билетов натиска, свободный опыт
  { id: "r_rare_1", name: "250 000 кредитов", type: "credits", rarity: "rare", chance: 12, image: "/images/250k.png", isGuaranteed: false, description: "Кредиты", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "credits250" },
  { id: "r_rare_2", name: "500 000 кредитов", type: "credits", rarity: "rare", chance: 10, image: "/images/500k.png", isGuaranteed: false, description: "Кредиты", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "credits500" },
  { id: "r_rare_3", name: "150 бон", type: "bonds", rarity: "rare", chance: 10, image: "/images/150bonds.png", isGuaranteed: false, description: "Боны", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "bonds150" },
  { id: "r_rare_4", name: "100 бон", type: "bonds", rarity: "rare", chance: 10, image: "/images/100bonds.png", isGuaranteed: false, description: "Боны", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "bonds100" },
  { id: "r_rare_5", name: "10 билетов натиска", type: "tickets", rarity: "rare", chance: 12, image: "/images/tickets10.png", isGuaranteed: false, description: "Билеты натиска", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "tickets10" },
  { id: "r_rare_6", name: "25 000 свободного опыта", type: "freexp", rarity: "rare", chance: 10, image: "/images/freexp25k.png", isGuaranteed: false, description: "Свободный опыт", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "freexp25k" },
  { id: "r_rare_7", name: "50 000 свободного опыта", type: "freexp", rarity: "rare", chance: 8, image: "/images/freexp50k.png", isGuaranteed: false, description: "Свободный опыт", sound: "/sounds/rare.mp3", hasParticles: false, color: null, backendId: "freexp50k" },
  // Простой: 100к кредитов, 50 бон, 3 билета натиска, свободный опыт
  { id: "r_common_1", name: "100 000 кредитов", type: "credits", rarity: "common", chance: 20, image: "/images/100k.png", isGuaranteed: false, description: "Кредиты", sound: "/sounds/common.mp3", hasParticles: false, color: null, backendId: "credits100" },
  { id: "r_common_2", name: "50 бон", type: "bonds", rarity: "common", chance: 18, image: "/images/50bonds.png", isGuaranteed: false, description: "Боны", sound: "/sounds/common.mp3", hasParticles: false, color: null, backendId: "bonds50" },
  { id: "r_common_3", name: "3 билета натиска", type: "tickets", rarity: "common", chance: 15, image: "/images/tickets.png", isGuaranteed: false, description: "Билеты натиска", sound: "/sounds/common.mp3", hasParticles: false, color: null, backendId: "tickets3" },
  { id: "r_common_4", name: "5 000 свободного опыта", type: "freexp", rarity: "common", chance: 16, image: "/images/freexp5k.png", isGuaranteed: false, description: "Свободный опыт", sound: "/sounds/common.mp3", hasParticles: false, color: null, backendId: "freexp5k" },
  { id: "r_common_5", name: "10 000 свободного опыта", type: "freexp", rarity: "common", chance: 12, image: "/images/freexp10k.png", isGuaranteed: false, description: "Свободный опыт", sound: "/sounds/common.mp3", hasParticles: false, color: null, backendId: "freexp10k" },
];
