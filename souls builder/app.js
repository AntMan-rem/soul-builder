```javascript
/*
    SOULS BUILDER
    Independent Study: Computer Science

    Version 1
    Character builder + equipment requirements
    + basic stat calculations + damage calculator
*/


// ==========================================
// GAME DATA
// ==========================================

const weapons = [
    {
        name: "Iron Greatsword",
        strength: 20,
        dexterity: 10,
        intelligence: 0,
        faith: 0,
        weight: 12,
        baseDamage: 120,
        strengthScaling: 1.4,
        dexScaling: 0.4
    },

    {
        name: "Knight Sword",
        strength: 12,
        dexterity: 14,
        intelligence: 0,
        faith: 0,
        weight: 5,
        baseDamage: 95,
        strengthScaling: 0.8,
        dexScaling: 1.1
    },

    {
        name: "Flame Staff",
        strength: 6,
        dexterity: 8,
        intelligence: 18,
        faith: 0,
        weight: 3,
        baseDamage: 50,
        strengthScaling: 0.1,
        dexScaling: 0.2,
        intelligenceScaling: 1.5
    },

    {
        name: "Sacred Hammer",
        strength: 18,
        dexterity: 8,
        intelligence: 0,
        faith: 20,
        weight: 9,
        baseDamage: 110,
        strengthScaling: 1.1,
        dexScaling: 0.2,
        faithScaling: 1.0
    }
];


const armor = [
    {
        name: "Traveler Armor",
        strength: 0,
        weight: 4,
        defense: 25
    },

    {
        name: "Knight Armor",
        strength: 15,
        weight: 12,
        defense: 60
    },

    {
        name: "Heavy Armor",
        strength: 25,
        weight: 22,
        defense: 100
    }
];


const spells = [
    {
        name: "Fire Bolt",
        intelligence: 12,
        faith: 0,
        baseDamage: 70,
        scaling: 1.2
    },

    {
        name: "Ice Spear",
        intelligence: 18,
        faith: 0,
        baseDamage: 95,
        scaling: 1.4
    },

    {
        name: "Holy Light",
        intelligence: 0,
        faith: 20,
        baseDamage: 110,
        scaling: 1.3
    }
];


// ==========================================
// CHARACTER
// ==========================================

const character = {

    name: "Unnamed",
    level: 1,

    attributes: {
        vigor: 10,
        mind: 10,
        endurance: 10,
        strength: 10,
        dexterity: 10,
        intelligence: 10,
        faith: 10,
        arcane: 10
    },

    weapon: null,
    armor: null,
    spell: null
};


// ==========================================
// DOM ELEMENTS
// ==========================================

const attributesContainer =
    document.getElementById("attributes");

const weaponSelect =
    document.getElementById("weapon");

const armorSelect =
    document.getElementById("armor");

const spellSelect =
    document.getElementById("spell");


// ==========================================
// ATTRIBUTE SYSTEM
// ==========================================

const attributeNames = {

    vigor: "Vigor",

    mind: "Mind",

    endurance: "Endurance",

    strength: "Strength",

    dexterity: "Dexterity",

    intelligence: "Intelligence",

    faith: "Faith",

    arcane: "Arcane"
};


function createAttributeInterface() {

    attributesContainer.innerHTML = "";

    for (const attribute in character.attributes) {

        const row = document.createElement("div");

        row.className = "attribute-row";

        row.innerHTML = `

            <span class="attribute-name">
                ${attributeNames[attribute]}
            </span>

            <span
                class="attribute-value"
                id="value-${attribute}">
                ${character.attributes[attribute]}
            </span>

            <button
                onclick="changeAttribute('${attribute}', 1)">
                +
            </button>

            <button
                onclick="changeAttribute('${attribute}', -1)">
                -
            </button>
        `;

        attributesContainer.appendChild(row);
    }
}


function changeAttribute(attribute, amount) {

    const currentValue =
        character.attributes[attribute];

    const newValue =
        currentValue + amount;

    if (newValue < 1) {
        return;
    }

    character.attributes[attribute] = newValue;

    updateCharacter();
}


// ==========================================
// LEVEL / POINT SYSTEM
// ==========================================

function calculateUsedLevels() {

    let total = 0;

    for (const attribute in character.attributes) {

        total +=
            character.attributes[attribute] - 10;
    }

    return Math.max(total, 0);
}


function calculatePointsRemaining() {

    const availablePoints =
        Math.max(character.level - 1, 0);

    const usedPoints =
        calculateUsedLevels();

    return Math.max(
        availablePoints - usedPoints,
        0
    );
}


// ==========================================
// EQUIPMENT
// ==========================================

function canUseWeapon(weapon) {

    const stats = character.attributes;

    return (
        stats.strength >= weapon.strength &&
        stats.dexterity >= weapon.dexterity &&
        stats.intelligence >= weapon.intelligence &&
        stats.faith >= weapon.faith
    );
}


function canUseArmor(item) {

    return (
        character.attributes.strength >=
        item.strength
    );
}


function canUseSpell(spell) {

    return (
        character.attributes.intelligence >=
            spell.intelligence &&

        character.attributes.faith >=
            spell.faith
    );
}


function populateEquipment() {

    weaponSelect.innerHTML = "";

    weapons.forEach((weapon, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent =
            canUseWeapon(weapon)
                ? weapon.name
                : `${weapon.name} (Locked)`;

        option.disabled =
            !canUseWeapon(weapon);

        weaponSelect.appendChild(option);
    });


    armorSelect.innerHTML = "";

    armor.forEach((item, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent =
            canUseArmor(item)
                ? item.name
                : `${item.name} (Locked)`;

        option.disabled =
            !canUseArmor(item);

        armorSelect.appendChild(option);
    });


    spellSelect.innerHTML = "";

    spells.forEach((spell, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent =
            canUseSpell(spell)
                ? spell.name
                : `${spell.name} (Locked)`;

        option.disabled =
            !canUseSpell(spell);

        spellSelect.appendChild(option);
    });


    updateSelectedEquipment();
}


// ==========================================
// SELECTED EQUIPMENT
// ==========================================

function updateSelectedEquipment() {

    const weapon =
        weapons[weaponSelect.value];

    const selectedArmor =
        armor[armorSelect.value];

    const spell =
        spells[spellSelect.value];


    character.weapon = weapon;

    character.armor = selectedArmor;

    character.spell = spell;


    document.getElementById("weaponInfo").textContent =
        `Requirements: STR ${weapon.strength} | DEX ${weapon.dexterity} | INT ${weapon.intelligence} | FAI ${weapon.faith}`;


    document.getElementById("armorInfo").textContent =
        `Requirement: STR ${selectedArmor.strength} | Defense: ${selectedArmor.defense}`;


    document.getElementById("spellInfo").textContent =
        `Requirements: INT ${spell.intelligence} | FAI ${spell.faith}`;


    calculateStatistics();
    updateSummary();
}


// ==========================================
// CHARACTER STATISTICS
// ==========================================

function calculateStatistics() {

    const stats =
        character.attributes;

    const weapon =
        character.weapon;

    const selectedArmor =
        character.armor;


    const health =
        100 + (stats.vigor * 25);


    const stamina =
        50 + (stats.endurance * 10);


    let attackPower =
        weapon ? weapon.baseDamage : 0;


    if (weapon) {

        attackPower +=
            stats.strength *
            weapon.strengthScaling;

        attackPower +=
            stats.dexterity *
            weapon.dexScaling;

        attackPower +=
            stats.intelligence *
            (weapon.intelligenceScaling || 0);

        attackPower +=
            stats.faith *
            (weapon.faithScaling || 0);
    }


    const defense =
        20 +
        (stats.vigor * 2) +
        (selectedArmor
            ? selectedArmor.defense
            : 0);


    const magicPower =
        20 +
        stats.intelligence * 2 +
        stats.faith * 1.5;


    const weight =
        selectedArmor
            ? selectedArmor.weight
            : 0;


    document.getElementById("health")
        .textContent =
        Math.round(health);

    document.getElementById("stamina")
        .textContent =
        Math.round(stamina);

    document.getElementById("attackPower")
        .textContent =
        Math.round(attackPower);

    document.getElementById("defense")
        .textContent =
        Math.round(defense);

    document.getElementById("magicPower")
        .textContent =
        Math.round(magicPower);

    document.getElementById("weight")
        .textContent =
        weight;
}


// ==========================================
// DAMAGE CALCULATOR
// ==========================================

function calculateDamage() {

    const weapon =
        character.weapon;

    if (!weapon) {
        return;
    }


    const stats =
        character.attributes;


    let damage =
        weapon.baseDamage;


    damage +=
        stats.strength *
        weapon.strengthScaling;


    damage +=
        stats.dexterity *
        weapon.dexScaling;


    damage +=
        stats.intelligence *
        (weapon.intelligenceScaling || 0);


    damage +=
        stats.faith *
        (weapon.faithScaling || 0);


    const dummy =
        document.getElementById("dummy").value;


    const resistance = {

        normal: 1,

        fire: 0.70,

        ice: 0.70,

        magic: 0.70,

        holy: 0.70
    };


    damage *= resistance[dummy];


    document.getElementById("damage")
        .textContent =
        Math.round(damage);
}


// ==========================================
// BUILD SUMMARY
// ==========================================

function updateSummary() {

    const name =
        document.getElementById("characterName")
            .value || "Unnamed";


    character.name = name;


    const summary =
        document.getElementById("summary");


    const stats =
        character.attributes;


    summary.innerHTML = `

        <div class="summary-section">

            <div class="summary-title">
                ${name}
            </div>

            Level:
            ${character.level}

        </div>


        <div class="summary-section">

            <strong>Attributes</strong><br>

            Vigor: ${stats.vigor}<br>
            Mind: ${stats.mind}<br>
            Endurance: ${stats.endurance}<br>
            Strength: ${stats.strength}<br>
            Dexterity: ${stats.dexterity}<br>
            Intelligence: ${stats.intelligence}<br>
            Faith: ${stats.faith}<br>
            Arcane: ${stats.arcane}

        </div>


        <div class="summary-section">

            <strong>Equipment</strong><br>

            Weapon:
            ${character.weapon
                ? character.weapon.name
                : "None"}<br>

            Armor:
            ${character.armor
                ? character.armor.name
                : "None"}<br>

            Spell:
            ${character.spell
                ? character.spell.name
                : "None"}

        </div>
    `;
}


// ==========================================
// UPDATE EVERYTHING
// ==========================================

function updateCharacter() {

    const levelInput =
        document.getElementById("level");


    character.level =
        Number(levelInput.value);


    document.getElementById("pointsRemaining")
        .textContent =
        calculatePointsRemaining();


    for (const attribute in character.attributes) {

        const value =
            document.getElementById(
                `value-${attribute}`
            );

        if (value) {

            value.textContent =
                character.attributes[attribute];
        }
    }


    populateEquipment();

    calculateStatistics();

    updateSummary();
}


// ==========================================
// RESET
// ==========================================

function resetBuild() {

    character.name = "Unnamed";

    character.level = 1;


    character.attributes = {

        vigor: 10,
        mind: 10,
        endurance: 10,
        strength: 10,
        dexterity: 10,
        intelligence: 10,
        faith: 10,
        arcane: 10
    };


    character.weapon = null;
    character.armor = null;
    character.spell = null;


    document.getElementById("characterName")
        .value = "";

    document.getElementById("level")
        .value = 1;


    createAttributeInterface();

    updateCharacter();
}


// ==========================================
// SAVE BUILD
// ==========================================

function saveBuild() {

    const build = {

        name: character.name,

        level: character.level,

        attributes:
            character.attributes,

        weapon:
            character.weapon
                ? character.weapon.name
                : null,

        armor:
            character.armor
                ? character.armor.name
                : null,

        spell:
            character.spell
                ? character.spell.name
                : null
    };


    localStorage.setItem(
        "soulsBuilderSave",
        JSON.stringify(build)
    );


    alert(
        "Build saved successfully!"
    );
}


// ==========================================
// EVENT LISTENERS
// ==========================================

document
    .getElementById("level")
    .addEventListener(
        "input",
        updateCharacter
    );


document
    .getElementById("characterName")
    .addEventListener(
        "input",
        updateSummary
    );


weaponSelect
    .addEventListener(
        "change",
        updateSelectedEquipment
    );


armorSelect
    .addEventListener(
        "change",
        updateSelectedEquipment
    );


spellSelect
    .addEventListener(
        "change",
        updateSelectedEquipment
    );


document
    .getElementById("calculateDamage")
    .addEventListener(
        "click",
        calculateDamage
    );


document
    .getElementById("saveBuild")
    .addEventListener(
        "click",
        saveBuild
    );


document
    .getElementById("resetBuild")
    .addEventListener(
        "click",
        resetBuild
    );


// ==========================================
// START APPLICATION
// ==========================================

createAttributeInterface();

updateCharacter();
```
