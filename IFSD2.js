const { MongoClient } = require("mongodb");
const prompt = require("prompt-sync")();

const uri = "mongodb+srv://lekhanambsc22:lekhana1234@cluster0.6mzbdkz.mongodb.net/see?retryWrites=true&w=majority";
const dbName = "see";
const collectionName = "animals";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to the database");
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return collection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

async function disconnectFromDatabase(client) {
  try {
    await client.close();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
  }
}

async function createAnimal(collection) {
  const species = prompt("Enter the species of the animal: ");
  const initialPopulation = parseInt(prompt("Enter the initial population: "));
  const birthRate = parseFloat(prompt("Enter the birth rate (e.g., 0.1 for 10%): "));
  const deathRate = parseFloat(prompt("Enter the death rate (e.g., 0.05 for 5%): "));

  const animal = {
    species,
    initialPopulation,
    birthRate,
    deathRate,
  };

  const result = await collection.insertOne(animal);
  console.log("Animal created successfully");
}

async function readAnimals(collection) {
  const animals = await collection.find({}).toArray();
  console.log("Animals:");
  animals.forEach((animal) => {
    console.log(animal);
  });
}

async function updateAnimal(collection) {
  const species = prompt("Enter the species of the animal to update: ");
  const filter = { species };
  const update = {
    $set: {
      initialPopulation: parseInt(prompt("Enter the new initial population: ")),
      birthRate: parseFloat(prompt("Enter the new birth rate: ")),
      deathRate: parseFloat(prompt("Enter the new death rate: ")),
    },
  };

  const result = await collection.updateOne(filter, update);
  if (result.modifiedCount === 1) {
    console.log("Animal updated successfully");
  } else {
    console.log("Animal not found");
  }
}

async function deleteAnimal(collection) {
  const species = prompt("Enter the species of the animal to delete: ");
  const filter = { species };

  const result = await collection.deleteOne(filter);
  if (result.deletedCount === 1) {
    console.log("Animal deleted successfully");
  } else {
    console.log("Animal not found");
  }
}

async function main() {
  let client;
  try {
    client = new MongoClient(uri);
    const collection = await connectToDatabase();

    while (true) {
      console.log("\n--- Zoo Management System ---");
      console.log("1. Create an animal");
      console.log("2. Read all animals");
      console.log("3. Update an animal");
      console.log("4. Delete an animal");
      console.log("0. Exit");

      const choice = parseInt(prompt("Enter your choice: "));
      console.log();

      switch (choice) {
        case 1:
          await createAnimal(collection);
          break;
        case 2:
          await readAnimals(collection);
          break;
        case 3:
          await updateAnimal(collection);
          break;
        case 4:
          await deleteAnimal(collection);
          break;
        case 0:
          console.log("Exiting...");
          return;
        default:
          console.log("Invalid choice. Please try again.");
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (client) {
      await disconnectFromDatabase(client);
    }
  }
}

main().catch(console.error);