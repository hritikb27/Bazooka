const { expect } = require("chai");
const { ethers } = require("hardhat");
const bz = require('./abi.js')

describe("Greeter", function () {
  let greeter;
  let bzContract;

  before(async () => {
    const Greeter = await ethers.getContractFactory("Bazooka");
    greeter = await Greeter.deploy(5);
    await greeter.deployed();

    console.log("massSend contract deployed to:", greeter.address);
})  

beforeEach(async function() {
    signers =  await ethers.getSigners();
    bzContract = new ethers.Contract(greeter.address, bz.abi, signers[0]);
})
  
  it("Should return the new greeting once it's changed", async function () {
    expect((await greeter.getBalance()).toString()).to.equal('0');

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  // it("Should create battle", async function () {
  //   expect(await greeter.createInitialBattle('0x2d8922fE1c0847F5fd1550FDb39c3e0584F4edB7','acascascasca.com','nft1')).to.equal();

  // });
  
  it("Should return battle data", async function () {
    const Greeter = await ethers.getContractFactory("Bazooka");
    const greeter = await Greeter.deploy(5);
    await greeter.deployed();
    await greeter.createInitialBattle('0x2d8922fE1c0847F5fd1550FDb39c3e0584F4edB7','acascascasca.com','nft1')
    await greeter.connect('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199').transfer('0x2d8922fE1c0847F5fd1550FDb39c3e0584F4edB7', 50);
    expect((await greeter.getBalance()).toString()).to.equal('0');

  });
  
});
