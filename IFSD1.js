const prompt = require('prompt-sync')();

class Animal {
  constructor(species, initialPopulation, birthRate, deathRate) {
    this.species = species;
    this.population = initialPopulation;
    this.birthRate = birthRate;
    this.deathRate = deathRate;
  }
  calculatePopulationAfterYears(years) {
    let population = this.population;
    for (let i = 0; i < years; i++) {
      population += population * this.birthRate - population * this.deathRate;
    }
    return population;
  }
}

class Zoo {
  constructor() {
    this.animals = [];
  }

  addAnimal(animal) {
    this.animals.push(animal);
  }

  calculateTotalPopulationAfterYears(years) {
    let totalPopulation = 0;
    for (let animal of this.animals) {
      totalPopulation += animal.calculatePopulationAfterYears(years);
    }
    return totalPopulation;
  }
}

function main() {
  const zoo = new Zoo();

  const numAnimals = parseInt(prompt("Enter the number of animals in the zoo:"));

  for (let i = 0; i < numAnimals; i++) {
    const species = prompt(`Enter the species of animal ${i + 1}:`);
    const initialPopulation = parseInt(prompt(`Enter the initial population of ${species}:`));
    const birthRate = parseFloat(prompt(`Enter the birth rate of ${species} (e.g., 0.1 for 10%):`));
    const deathRate = parseFloat(prompt(`Enter the death rate of ${species} (e.g., 0.05 for 5%):`));

    const animal = new Animal(species, initialPopulation, birthRate, deathRate);
    zoo.addAnimal(animal);
  }

  const years = parseInt(prompt("Enter the number of years:"));
  const totalPopulation = zoo.calculateTotalPopulationAfterYears(years);
  console.log("Total population after", years, "years:", totalPopulation);
}

main();