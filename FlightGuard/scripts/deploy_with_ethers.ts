// All necessary code is now in this single file.

import { ethers } from 'ethers'

// This deploy function is now directly inside this script
async function deploy(contractName: string, args: Array<any>): Promise<ethers.Contract> {
    console.log(`deploying ${contractName}`)
    // Note that the script needs the ABI which is generated from the compilation artifact.
    // Make sure contract is compiled and artifacts are generated
    const artifactsPath = `browser/contracts/artifacts/${contractName}.json` // Using the simple path

    const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))

    const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()

    const factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer)

    const contract = await factory.deploy(...args)

    // The contract is NOT deployed yet; we must wait until it is mined
    await contract.deployed()
    return contract
}


// This is the main execution part of the script
(async () => {
  try {
    const result = await deploy('FlightGuardToken', [])
    console.log(`address: ${result.address}`)
  } catch (e) {
    console.log(e.message)
  }
})()