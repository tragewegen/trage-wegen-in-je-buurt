
export function TW_JUR_STATUUT(feat) {
    switch (parseInt(feat.TW_JUR_STATUUT)) {
        case -7: return "Feitelijke weg, ander statuut dan buurtweg";
        case -8: return "Statuut niet gekend";
        case 1: return "Gemeenteweg s.s.";
        case 2: return "Buurtweg";
        case 3: return "Privéweg in feitelijke toestand van openbare weg";
        case 4: return "Losweg in feitelijke toestand van openbare weg";
        case 5: return "Publieke erfdienstbaarheid van doorgang";
        case 6: return "Andere";
        default: return '<i>null</i>';
    }
}
  
export function TW_DAT_INVENTARISATIE(feat) {
    return (new Date(Date.parse(feat.TW_DAT_INVENTARISATIE))).toLocaleDateString(
        'nl-be', { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}
  
export function TW_TOEGANKELIJK(feat) {
    switch (parseInt(feat.TW_TOEGANKELIJK)) {
        case -8: return "Ongekend";
        case 1: return "Toegankelijk";
        case 2: return "Niet-toegankelijk";
        default: return '<i>null</i>';
    }
}
     
export function TW_NIET_TG_REDEN(feat) {
    switch (parseInt(feat.TW_NIET_TG_REDEN)) {
        case -7: return "andere";
        case -8: return "niet gekend";
        case -9: return "niet van toepassing";
        case 1: return "natuurlijke omstandigheden";
        case 2: return "niet-permanente afsluiting (poort, bareel, hek, draad)";
        case 3: return "verbodsteken";
        default: return '<i>null</i>';
    }
}
  
export function TW_ZICHTBAAR(feat) {
    switch (parseInt(feat.TW_ZICHTBAAR)) {
        case -8: return "Ongekend";
        case 1: return "Zichtbaar";
        case 2: return "Niet-zichtbaar";
        default: return "<i>null</i>";
    }
}
  
export function TW_NIET_ZB_REDEN(feat) {
    switch (parseInt(feat.TW_NIET_ZB_REDEN)) {
        case -7: return "andere";
        case -8: return "niet gekend";
        case -9: return "niet van toepassing";
        case 1: return "straat voor autoverkeer";
        case 2: return "akker, omgeploegd";
        case 3: return "weiland of ander landbouwland";
        case 4: return "verkaveld naar woongebied";
        case 5: return "bedrijventerrein";
        case 6: return "andere bebouwing";
        case 7: return "tracé onderbroken door grote verkeersinfrastructuur";
        default: return 'andere';
    }
}
  
export function TW_VERHARDING(feat) {
    switch (parseInt(feat.TW_VERHARDING)) {
        case -7: return "andere";
        case -8: return "niet gekend";
        case -9: return "niet van toepassing";
        case 10: return "verhard - niet verder gespecifieerd";
        case 11: return "asfalt";
        case 12: return "beton";
        case 13: return "klinkers, tegels of andere kleinschalige verharding";
        case 14: return "kasseien";
        case 15: return "tweesporenpad";
        case 20: return "halfverhard - niet verder gespecifieerd";
        case 21: return "grind of kiezel";
        case 22: return "puin of steenslag";
        case 23: return "dolomiet";
        case 24: return "ternair zand";
        case 25: return "schelpenzand";
        case 26: return "boomschors of hakselhout";
        case 27: return "knuppelpad";
        case 30: return "onverhard - niet verder gespecifieerd";
        case 31: return "los zand";
        case 32: return "aarde, aangestampt";
        case 33: return "gras";
        default: return '<i>null</i>';
    }
}
  
export function TW_BREEDTE(feat) {
    switch (parseInt(feat.TW_BREEDTE)) {
        case -8: return 'Ongekend';
        case 1: return "1 meter";
        case 2: return "2 meter";
        case 3: return "3 meter";
        case 4: return "4 meter";
        case 5: return "5 meter";
        case 6: return "6 meter";
        case 7: return "7 meter";
        case 8: return "8 meter";
        case 9: return "9 meter";
        case 10: return "10 meter";
        case 11: return "11 meter";
        case 12: return "12 meter";
        default: return '<i>null</i>';
    }
}

