import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi"
import { MerkleTree } from 'merkletreejs'
import { Buffer } from "buffer";
import { ethers } from "ethers";
import "./styles/minter.css";

const keccak256 = require("keccak256")

window.Buffer = window.Buffer || Buffer;


const allowLeaves = [
    "0x745147f70B5912e6DD134e0502B3914e6F6d98A0",
    "0xb7eCBF7070e3FbB20AE7Ad431933895439f7f32e",
    "0x74fa1bE357bC182c88BA77E771a5502e2b271F1B",
    "0x09A3Ed4C3B477E53850edE0AAC96681BA314193B",
    "0x7D406dE3d4B2970DA41414f2024ac0FC87D41Ca5",
    "0x97c19F6FAfFec1f1704DEf5a01c5f571608406dE",
    "0x6837C1Cf7ea61A76CeA60AB1196EFd20f1A9f8a3",
    "0x4533d1F65906368ebfd61259dAee561DF3f3559D",
    "0xF6ec5b0D097178a0ACf493AfDcdA2A54545aB0f3",
    "0x45909B8ACc1ace1Ba9910EA7023EEDa492ba058c",
    "0x60377EC355857C2d06D1Ce28555f624257344B0D",
    "0x3A0A8ECD310C23E909f7ca96E0b7Ec42d2C4a957",
    "0x031f2147E9eC8d00bD463CDCD263D3646D91AC3e",
    "0xa30C725B985e0e574ad39FD72E96953C14371C5E",
    "0x641C2fEF13fb417dB01EF955a54904a6400F8b07",
    "0x048eb03324123C8413993d0517542C48BFA35878",
    "0x2885e8073a107127aD7173918500A5a5BAc2bB93",
    "0x717d9f10f98e05949f89389B8d09e83c2FeB9d91",
    "0x7B3158a3480bbb77E8bd024ba9C5632321f8c9Ba",
    "0x4b4602f08C6ba6d25d0BBbE1f2e97101B3aeC7a7",
    "0x19dD9425fC3bff996D0EB3f21AFB457C467d1882",
    "0xb0ae08CA5e818473C728dcce669BC4B2d6c444eB",
    "0x6B0EA34cC854316dd8784502Ff85C1CB24F800b4",
    "0x00000277a9Cf40ca30Eb0BD0fC9C04b3BcABcADC",
    "0xBDc621888DD7CF58554b799205FFdff29f7D3C5F",
    "0x3bB6d0FEFF2f1b4a75e52683E91e2AB19aabcB91",
    "0xE4260Df86f5261A41D19c2066f1Eb2Eb4F009e84",
    "0xa49A4Dd47963445Ed838E58A44722d675827567b",
    "0x17A53959bAFe1070F64A2B424145B62cBE282dd7",
    "0x9615A87530d02326dBe1030ab4D9692BD89377cd",
    "0xF035839DaaF652f03156B297a27EdA25a35e6316",
    "0xD09a70e83B784bBB781A31d0c0f51be81998F440",
    "0xdCdBBffbdB3a9615B7EF0fE15a0E542B765C404a",
    "0x40F9E193AeD5bd77d536DD781Fe94A8a285E4320",
    "0x9a6C29FD6069b6FD8d177203f10555F3F0dB80AB",
    "0x6f52dD4D2056a16b22E34Fa3962833a85DfBcAc2",
    "0x79C58393c40f6498c5DA80336907e7B5594e92bC",
    "0xa43a8B5CA81CCfEde49c7435d2cD89cD12E12845",
    "0x40B55fF1Cb044e6D1b1C12086A5cefB1374f0F30",
    "0x32910171B0A19Ab0ac1B732824F3F747a7492B34",
    "0xf0477C81d749b6bD4B38108e04b4d80f000cac7B",
    "0x1C65841EDa71e91b0dC43DD17bd5aa52b03EE364",
    "0x367B15f8B3b8A74eb93387b292e8f7ec32bbDDf8",
    "0x76c465aeB522D8A037B3A061054b293c9c330C51",
    "0xd5bc65ED8FEF954D959F7f32c97a6Da7A046f9D7",
    "0xfAB22550fcD520A7eCED27414CD74Bc70a6ac1a9",
    "0xE85041b675b616f635798A63db467289E5aA1E4D",
    "0x8E2Fe9250F97d8bA2D59aAc671f03FF667b011E1",
    "0x8caae70F293a74f228C6eceaFc9817369741A84A",
    "0xE7D11c8601ECd7CFbF3BD5b0f74157773979Ea84",
    "0xECc953EFBd82D7Dea4aa0F7Bc3329Ea615e0CfF2",
    "0xc4DaD120712A92117Cc65D46514BE8B49ED846a1",
    "0x1223e13Ff2316d55EFc0a67fb53b80F1cf9DeE70",
    "0x4aDB9Cf90c2a3aF77A23199d5D6398e3d43d78C8",
    "0xa9feDB1c6cD4da403E040AcDc7520d94c5F04949",
    "0xbb270795989F3762368947A431C1D1D6F3eb1887",
    "0xE8DD28426EA7e8514500a04A4577bCcB8A4855Fd",
    "0xd35fC346e15BA5b446917C9fD23A9471d6144701",
    "0xE18e6002c7Ce832b2a6A23c6C00c04CFf461A56D",
    "0xa9f1174273893EB943a725E297524C4B6D10A9ca",
    "0x04ADD7baA4cF4D9b93ce91585BFFEc5964868397",
    "0x6a1651C0bE3c2c2cfEA1463120e00B0c1f97f919",
    "0x11FCb66497628e2466dF1e2ed2D5E5F7F4954693",
    "0xE91e155b44024695059EE4f2B825E044Fe83721D",
    "0x11f00D6C9116555b5Dd46f5E283750013ed7aa5E",
    "0x792b4Ed2b3DDBCEf0A3ae09810f3925105A3d6c1",
    "0x2e777a4f557c19a3f2BCcF1d033C0cb7Ea0722Aa",
    "0xf7E744527cc82E24C3Badc2082d0391413b321E5",
    "0x378dcff8e6be1778b04F5712d686517Bb6a01927",
    "0x9Ee370a169196b497E50498CD4FfCBFF190D0f9f",
    "0xdCB3963Cd55d1Ba8674326CE63aA75B5D01FB48b",
    "0x30A0B4eC17516c4e8ce3e19B9A7279D446f0eE61",
    "0x718d6166707c1880899AA2C924b15aBC3BF3f3be",
    "0x29773d7DF768c0De50397b9C1e7f71E4Ee528cd8",
    "0xE76d6f8747A0E41c92567fA634335f97eb1597f4",
    "0x699FD96Ee6f8C31DC3C2c5fA94FdC21B5052Efd5",
    "0xF655E23B8e53402833519B1DE7eCbD4f63D5e6ad",
    "0x9364a51Fa704DD0816FbC91D5D8d26CA1c358d21",
    "0x440415F01a4566c8eeAab16545F266FB134F8861",
    "0xEdC166696b2FaFfc2E5040654f9f609e6DEe6ED0",
    "0xE3b2e0086D5A9A7f8Fb7b48107b6bDeFC97C8AB2",
    "0xBC3E746c622a4B8B3f70fcf43C0ff0d4c66452FE",
    "0x2e697C5D5bC0E1d7b292CcDaA9450a114d1A7482",
    "0xe43E23A61f22d42a24337F1E992DCd1d2d23435f",
    "0x50C400B6725d8Ba7bA62F685Fbd20D3E1958E4Cb",
    "0x854fb5E2E490f22c7e0b8eA0aD4cc8758EA34Bc9",
    "0x5C5bc3619FE3458E21887e1017Ba9EF6Ec5DeCE8",
    "0x478ED197Ed55AfCfB7Fd143057f64fc87C874B72",
    "0x695f6F677f888B8875895Ed3db10D86c5F0273c1",
    "0x0035E82A69644A85B5fD117d22494caFf1c893c1",
    "0xEE0db089D98DAFa516538b336184cf6B135a8Be0",
    "0xc30E9FDA779EfE2081dae6529c0D07Fc16769C8f",
    "0xa80064f4aD3e953CAB912645DfcB599c8C451034",
    "0xdfe813b81194A8f093ABbA7BaaB8A223f75d6022",
    "0xf0139b911A5A3d113DDB5F71418F8572EaCdE5eA",
    "0xa31A547758f695822fE582C76a6C404D5adC988F",
    "0x9F85C0a1cfe3AF69E3492Dc8b4Ebc11F79843fEe",
    "0x5383cEbe6ED6d7C89e1C3D472ee7c46794849346",
    "0x40E8958C27C1db4C770a8a2E8319578E62F62AbC",
    "0x44aE0c7007D3213902581f715052daaaeAEf7E5c",
    "0x1B9C6e60e590DEC05f7f6Ecf956EB62Ff17Dd8C4",
    "0x4533d1F65906368ebfd61259dAee561DF3f3559D",
    "0xa1f37db39063b34B0dba90D71C59bEB4432a977D",
    "0xBDfeB5439f5daecb78A17Ff846645A8bDBbF5725",
    "0xC780F8d738f8b8c5F566F6B43aF69ce221704C89",
    "0xA0BDF16f3C91633838ad715a4bC7e8B406093340",
    "0x538aD1b806f973B7f93Cd8aEeB18981b15A58A7a",
    "0x67ed35ed9d3bBb0b82596f4e0E07499a87AAc518",
    "0x8d43EE78Dc579C01cA8C59c736b10685843286Df",
    "0x6A7CC5E205BCe058454e1576419f3dAb1CE21637",
    "0x1fAD9f65B39d235469BCB59Bc664872B93EEcAc5",
    "0x42814CFb08B3a1F9fEDD618D35E4e2a156b4488B",
    "0x8Bb42B7e6730a1BE65C5a10a6ae337670314EcA7",
    "0x67c1FEc8db1d8328137281015Ec0bd46E2e82428",
    "0x0Ca725F5156241ee040506c4603b55D5B7586d86",
    "0x5383Fc41ED11A8e35e2c9F92dF8928e8D71363ED",
    "0x8E05bD9fA3059eC69C15bc1a6F4D94f0Ac26ce00",
    "0xd8625F9178A259b14F37Edd79d11100Dd5bB1c2F",
    "0xe42758403B8A6c02Ff81656856278f74985948Cd",
    "0x04853ba8768cB6a995f6B9De8E26209F9Ef0dbBd",
    "0x362dCF0F160293C15933eae643386fC63D3eEc49",
    "0x77Ef025811aC5B4e6BDeb224D42018B8b710bc75",
    "0xdaC26dbbb2B1d86747b517d4c5E8805ff51DCA35",
    "0x854569C81C1c7Fd8D664924AFF357bF5C4368a62",
    "0x5489Cd0329Ec89E54e849D1C44d90f556bC27c60",
    "0x45713e114C7c72a123CC90657432344E71d4f79c",
    "0xACF53DD3d1d136c08cE9f3e7dEBC2E09Ea5f4Cb0",
    "0x4BcE5438a4a42FA07532FB7245a655c81eFdde83",
    "0x4d42B6E1F84B449789ceD226f36F25e3CAf892Db",
    "0x0AD5812A4dDf78E18C9BcFa690ece3FECdF0cC90",
    "0x3F4389EbB50c33dB3810c573Df73FC2182cDD8f6",
    "0xFee57F81b3803e24fd74B995053CC8c24e8069BB",
    "0x4Dd5A4D1fcb6F8938aa8AD070aEFE1B19e8F9c0C",
    "0xE0A68caE437373160F1854E411Cce05841E1bbAF",
    "0xf737674EB90DE5A376CB947Bfd6E8f63635bBfbb",
    "0xb6502179bD7FB6791eA7F5FBc89944718039E865",
    "0x63F20D7D378fE34fDD03CA2c09040cA96E36e10B",
    "0x268335849210eD7fA42696732838a70024437d0d",
    "0xFaf503B43d3AAA149c858Be350023E15e1145177",
    "0x55810247af2951D40AA9e72dfB1765Cb5f2045A3",
    "0xB0e5CA05Aa921DA8b194766341EE6630f4288e98",
    "0x5B5fc02D41eAAFA7eCde3c02C3e5c59110A77d99",
    "0x5186773238b397f8F2e6dbf386E16915a637938b",
    "0x97B10F1d005C8edee0FB004af3Bb6E7B47c954fF",
    "0xA3BF2697f94b33bFef177f32cD24D033d8804c23",
    "0xC744292112d53b4857f7f0c4C210A4Fc45977a29",
    "0x037ccb73fd73f956901bcc4851040db81b8769d2",
    "0x2cab4d881962D247218356B32aBc4AA5c46bA0d2",
    "0xaF423481bb944D161EC44e01C8C2015314Ba290B",
    "0x415C1910Fe51171b43Cb58F6202d062933dbbfBB",
    "0x66Da05c4372335348378f5fdf45dABf212Ddb5bE",
    "0x59C505d1Ecb3bcEafC1925aC9bb0CE14FfB99417",
    "0x6420D18780f10F75134D2a744C669d6dCfd025dE",
    "0x4D21ECb2ad7F229d08b80eFFc2D016e192c1596e",
    "0x5bd6F3B7c2B2D0b3D67d4f335e7141F4C358Ab84",
    "0x2486a4EfF5FE101f55095Cd2496d02e7d67F7dc9",
    "0x3841B520Ad594A0AEB83C7d8a2d7260e878C5e19",
    "0x573f29879312A97C73fE6c29D90924104F0959cb",
    "0xc8fbe3bbadcd1829e153f1837fc5f7c53f280686",
    "0xf24b1e40AD90C4f94d32cE884c3eaf838D9d5a1"
].map(x => keccak256(x))
const circLeaves = [
    "0xc8fbe3bbadcd1829e153f1837fc5f7c53f280686",
    "0x573f29879312A97C73fE6c29D90924104F0959cb",
    "0x5148e66da253de7cc3d162a4995bf1dfd53d6465",
    "0x037ccb73fd73f956901bcc4851040db81b8769d2",
    "0xEC65d9F7959da144e18ef3af709546A27d182A2d",
    "0xF655E23B8e53402833519B1DE7eCbD4f63D5e6ad",
    "0x789963b7b2244758e3ed9e071772d0b04a20c8b2",
    "0x5B05E06988677DfB2f6d60a1aE50888944149d14",
    "0xEA78980594B02f805b607abA747b2b5FB907B708",
    "0xaF423481bb944D161EC44e01C8C2015314Ba290B",
    "0x8edb8ffdc0e690bb5852a7d83d48246f18250d18",
    "0xee8Df38386AA85Be55fdF1460a61d656c51A5e3B",
    "0x2882898129bfB577f756350d8443265038FCe7cc",
    "0xa495FB3EF5Ad8323ebE5B369f81785DB8236E018",
    "0x40914E01ab6d931506A0423231BfCD0bdD238694",
    "0xB0e5CA05Aa921DA8b194766341EE6630f4288e98",
    "0xF13a69F85075972AbB8435c8bBa1f24D91EFB986",
    "0xb6502179bD7FB6791eA7F5FBc89944718039E865",
    "0x42814cfb08b3a1f9fedd618d35e4e2a156b4488b",
    "0x2aca205C17f09DF227a06Aa8fe3eAadD912ad253",
    "0x2cab4d881962D247218356B32aBc4AA5c46bA0d2",
    "0x903c58885d18322FF15FCc025174b4dfBf8520CB",
    "0xA3BF2697f94b33bFef177f32cD24D033d8804c23",
    "0xe3dFF97E14F3a55228ED2F614114bf6b27a7677b",
    "0x9C562e8d7B08b14109cd505F049a53637B9f63D1",
    "0x706950294CCc9E1359BE51d154Aa960929ce50A1",
    "0x3b24037D7F7ED7B9fc30927b3829674a231604fA",
    "0x574482Bc77FeB1A7C7Ecb8de68d01EA75f64a552",
    "0xb41FF838A3F188b1434ff6e7f7b79055697E3Cf9",
    "0x792b4Ed2b3DDBCEf0A3ae09810f3925105A3d6c1",
    "0xDd2D9020d3E549616e66E373c5E9cf8871d0C2f6",
    "0xeFEed35D024CF5B59482Fa4BC594AaeAf694E669",
    "0x4533d1F65906368ebfd61259dAee561DF3f3559D",
    "0x5994CDA480E64DFB040dfe7c6397F8f643808801",
    "0xE85041b675b616f635798A63db467289E5aA1E4D",
    "0xE92D2A4255BC7e468D355644d24Ec5d9ac6eF13d",
    "0x173c46E68187C09E4Eb1D223b90a5789f7e6574A",
    "0xc438cb99e6ef34475352725cb71aa54eb76286a2",
    "0x04fDa51b80e23aCe7F696a2923c789bdDD49d39A",
    "0xe28E8446E049fB79b5501Ec5F467130aD9194c9A",
    "0x40E8958C27C1db4C770a8a2E8319578E62F62AbC",
    "0x1e6A7990f1F82220277a023D71e6348c35F3Cef5",
    "0xE76d6f8747A0E41c92567fA634335f97eb1597f4",
    "0xa49A4Dd47963445Ed838E58A44722d675827567b",
    "0xF552832498d5b913f65B2b0c5696f4D57b13F4E3",
    "0xd7f397173ad7ab808afebd138b5811bb1e9dc38b",
    "0x067526BAA12f7E65fe4D8080886C8F6078272456",
    "0x91Ab8A0D41b2E972a857920b7041392F4459FE9B",
    "0xe6B9F6b9cC3DAC911976008b131c2Ca634D576c5",
    "0xC744292112d53b4857f7f0c4C210A4Fc45977a29",
    "0x6f85B8b8fe10157f166EC55dFF7Ad3edC6D059Ec",
    "0x1fC18f965F60625f895434FC536Fa50c705F860c",
    "0xe42758403B8A6c02Ff81656856278f74985948Cd",
    "0x6B0EA34cC854316dd8784502Ff85C1CB24F800b4",
    "0xdaC26dbbb2B1d86747b517d4c5E8805ff51DCA35",
    "0xf737674EB90DE5A376CB947Bfd6E8f63635bBfbb",
    "0xa33e5e1ccf57c0caf78ae399061f270dd24ffcdf",
    "0xD6Df2693eEc9f1ED3526E2CdF053fBD076c89a44",
    "0xE0A68caE437373160F1854E411Cce05841E1bbAF",
    "0xBC3E746c622a4B8B3f70fcf43C0ff0d4c66452FE",
    "0x04ADD7baA4cF4D9b93ce91585BFFEc5964868397",
    "0xE85041b675b616f635798A63db467289E5aA1E4D",
    "0xb7eCBF7070e3FbB20AE7Ad431933895439f7f32e",
    "0x4B6B892B6878E61F421066A01FC03d0648228F82",
    "0x09A3Ed4C3B477E53850edE0AAC96681BA314193B",
    "0xA552834773f75822343535BF1cd918F532C8F25d",
    "0x5D22BAbFDc8047C4A91070Aa04759BDa4eA77F84",
    "0xc30E9FDA779EfE2081dae6529c0D07Fc16769C8f",
    "0x421D7e4021d75A5199B92E01E4b7730578A500a4",
    "0x55810247af2951D40AA9e72dfB1765Cb5f2045A3",
    "0xf7AF078D5fe8673df5B11Fc584836dD16D65f9BD",
    "0x641C2fEF13fb417dB01EF955a54904a6400F8b07",
    "0x6a94515417F4749a28d21F59f94589D1A1e0Abb3",
    "0xC780F8d738f8b8c5F566F6B43aF69ce221704C89",
    "0x60377EC355857C2d06D1Ce28555f624257344B0D",
    "0xe4260df86f5261a41d19c2066f1eb2eb4f009e84",
    "0x888f8aa938dbb18b28bdd111fa4a0d3b8e10c871",
    "0xdb4782d463628cc5b1de8f1220f755ba3ba4728e",
    "0xf7E744527cc82E24C3Badc2082d0391413b321E5",
    "0x7B3158a3480bbb77E8bd024ba9C5632321f8c9Ba",
    "0x378dcff8e6be1778b04F5712d686517Bb6a01927",
    "0x63F20D7D378fE34fDD03CA2c09040cA96E36e10B",
    "0x18E0f9AAdde970D74430cC8636A381CcFCD1F559",
    "0xf4974EbbAe7Ec9DB35d8125b3Ae7F00E42CCa06F"
].map(x => keccak256(x))
const freeLeaves = [
    "0x45f136D5bc17BBCB7AaFF759737d75928f7ebD89",
    "0xeBdBD504f79502fD31240457157E4005688FDDA5",
    "0xa33e5e1ccf57c0caf78ae399061f270dd24ffcdf",
    "0xaF423481bb944D161EC44e01C8C2015314Ba290B",
    "0xd7b064F257428e7B0d5f6216BC31EcDebdCCad62",
    "0x4B6B892B6878E61F421066A01FC03d0648228F82",
    "0xA3BF2697f94b33bFef177f32cD24D033d8804c23",
    "0xe4260df86f5261a41d19c2066f1eb2eb4f009e84",
    "0x888f8aa938dbb18b28bdd111fa4a0d3b8e10c871",
    "0x4533d1F65906368ebfd61259dAee561DF3f3559D",
    "0x037ccb73fd73f956901bcc4851040db81b8769d2",
    "0xeFEed35D024CF5B59482Fa4BC594AaeAf694E669",
    "0xfBba2696279F71E6eE820E2d1C52b53a5b331F66",
    "0xacb76875356a8c465103fe4aa15a0502937322ce",
    "0x87d8151435926af2aBAd90dc449db4EFfCB244de",
    "0xCB23daef22Bd7004DFe20291652553867D88e8D5",
    "0xF654CD6eF4A402622E62E1c98258834C9137564e"
].map(x => keccak256(x))

export default function Minter(props) {
    const contractAddress = props.address
    const { address, isConnected } = useAccount()

    const leaf = keccak256(address)


    const freeTree = new MerkleTree(freeLeaves, keccak256, { sortPairs: true })
    const circTree = new MerkleTree(circLeaves, keccak256, { sortPairs: true })
    const allowTree = new MerkleTree(allowLeaves, keccak256, { sortPairs: true })
    const freeProof = freeTree.getHexProof(leaf)
    const circProof = circTree.getHexProof(leaf)
    const allowProof = allowTree.getHexProof(leaf)

    const { config: publicConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: props.contractAbi,
        functionName: "mintPublic",
        overrides: {
            value: ethers.utils.parseEther("0.0365"),
        },
    })
    const { config: circConfig, error: circError } = usePrepareContractWrite({
        address: contractAddress,
        abi: props.contractAbi,
        functionName: "mintCircolorsPresale",
        args: [address, circProof],
        overrides: {
            value: ethers.utils.parseEther("0.0256"),
        },
    })
    const { config: allowConfig, error: allowError } = usePrepareContractWrite({
        address: contractAddress,
        abi: props.contractAbi,
        functionName: "mintAllowlist",
        args: [address, allowProof],
        overrides: {
            value: ethers.utils.parseEther("0.0365"),
        },
    })
    const { config: freeConfig, error: freeError } = usePrepareContractWrite({
        address: contractAddress,
        abi: props.contractAbi,
        functionName: "mintFreelist",
        args: [address, freeProof],
    })

    const { write: publicWrite } = useContractWrite(publicConfig)
    const { write: circWrite } = useContractWrite(circConfig)
    const { write: allowWrite } = useContractWrite(allowConfig)
    const { write: freeWrite } = useContractWrite(freeConfig)
    if (isConnected) {
        return (
            <div>
                {!circError &&
                    <button className="mint_btn" disabled={!circWrite} onClick={() => circWrite?.()}>Circ Presale</button>
                }
                {!allowError &&
                    <button className="mint_btn" disabled={!allowWrite} onClick={() => allowWrite?.()}>Mint Allowlist</button>
                }
                {!freeError &&
                    <button className="mint_btn" disabled={!freeWrite} onClick={() => freeWrite?.()}>Mint FREE</button>
                }
                <button className="mint_btn" disabled={!publicWrite} onClick={() => publicWrite?.()}>General Sale</button>
            </div>
        )
    }
    return (
        <div>Please connect to an ethereum wallet!</div>
    )
}