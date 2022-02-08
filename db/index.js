const pg = require('pg');

const client = new pg.Client('postgres://localhost/animals_db');

const syncAndSeed = async() => {
    const SQL = `
    DROP TABLE IF EXISTS funFacts;
    DROP TABLE IF EXISTS animal;
    CREATE TABLE animal(
        id INTEGER PRIMARY KEY,
        name VARCHAR(50) NOT NULL
    );
    CREATE TABLE funFacts (
        id INTEGER PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        fact VARCHAR(1000) NOT NULL,
        animal_id INTEGER REFERENCES animal(id)
    );

    INSERT INTO animal(id, name) VALUES(1, 'Sea Otter');
    INSERT INTO animal(id, name) VALUES(2, 'Polar Bear');
    INSERT INTO animal(id, name) VALUES(3, 'Cobra');
    INSERT INTO animal(id, name) VALUES(4, 'Panda');

    INSERT INTO funFacts(id, name, fact, animal_id) VALUES(1, 'Sea Otter', 'Sea otters always float on their backs when they eat. These marine mammals dine on animals including mussels, sea urchins, clams, and snails, all while floating on their backs. Their extremely dense fur protects them from the cold waters as they eat.', 1);
    INSERT INTO funFacts(id, name, fact, animal_id) VALUES(2, 'Polar Bear', 'Polar bears look white, but they actually have black skin. Unlike other bears, their fur is transparent and reflects visible light. This allows polar bears, which live in the arctic tundra, to blend in with their snow covered environment.', 2);
    INSERT INTO funFacts(id, name, fact, animal_id) VALUES(3, 'Cobra', 'Cobras are able to kill with a bite as soon as they are born. Baby cobra venom is just as potent as an adult cobras venom. Their bite is dangerous because cobras can inject large amounts of venom in a single bite. Cobra venom contains a neurotoxin that affects the central nervous system and can lead to paralysis, respiratory system failure, and death.', 3);
    INSERT INTO funFacts(id, name, fact, animal_id) VALUES(4, 'Panda', 'Pandas must eat 25 to 90 pounds (12-38 kg) of bamboo every day to meet their energy needs.This is because bamboo contains very little nutritional value, so they have to eat it in vast quantities to survive. Although the giant panda possess the digestive system of a carnivore, they have evolved to depend almost entirely on bamboo.', 4);
    `;
    
    await client.query(SQL);
};

module.exports = {
    client,
    syncAndSeed
};