import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import NFT from "./../artifacts/contracts/NFT.sol/NFT.json";
import Market from "./../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { NFTAddress, MarketAddress } from "../config";
import Product from "../components/single-components/Product";
import ProductLoadAnim from "../components/single-components/ProductLoadAnim";
// import Alert from '../components/single-components/Alert'

export default function Home() {
  const [alert, setAlert] = useState({ isAlert: false, type: "", message: "" });
  const [NFTs, setNFTs] = useState([]);
  const [signer, setSigner] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Handle Fetching NFTs
  async function handleLoadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://rinkeby.infura.io/v3/${process.env.RPC_Provider_Id}`
    );
    const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      MarketAddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();
    // Getting Market Items
    const items = await Promise.all(
      data.map(async (dataItem) => {
        const tokenURI = await tokenContract.tokenURI(dataItem.tokenId); // i.e. something like http:\\.....
        const meta = await axios.get(tokenURI); // Getting Token[NFT] info
        let price = ethers.utils.formatUnits(
          dataItem.price.toString(),
          "ether"
        );
        let item = {
          itemId: dataItem.itemId.toNumber(),
          contractAddress: dataItem.nftContract,
          tokenId: dataItem.tokenId.toNumber(),
          seller: dataItem.seller,
          owner: dataItem.owner,
          price,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    ).catch((e) => {
      console.log(e);
    });
    setNFTs(items);
    setDataLoaded(true);
  }
  // Handle Buying NFTs
  const handleBuyNft = async (nft) => {
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);

    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // const signer = provider.getSigner();
    const contract = new ethers.Contract(MarketAddress, Market.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    try {
      const transaction = await contract.createMarketSale(
        NFTAddress,
        nft.itemId,
        { value: price }
      );
      await transaction.wait();
    } catch (error) {
      console.log(error);
    }
    handleLoadNFTs();
  };
  // useEffect Hook
  console.log("Signer Home:", signer);
  useEffect(() => {
    handleLoadNFTs();
    if (signer) return;
    else {
      (async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        setSigner(provider.getSigner());
      })().catch((err) => {
        console.error(err);
      });
    }
  }, []);
  if (dataLoaded && !NFTs?.length)
    return (
      <React.Fragment>
        <div className="bg-white">
          <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* Heading */}
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              There is no Item in this Market Place
            </h2>
          </div>
        </div>
      </React.Fragment>
    );
  return (
    <React.Fragment>
      {/* {alert.isAlert && <Alert type={alert.type} message={alert.message}/>} */}
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Heading */}
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Featured Collections
          </h2>
          {/* Products */}
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {dataLoaded
              ? NFTs?.map((nft, key) => (
                  <Product product={nft} key={key} onBuy={handleBuyNft} />
                ))
              : [...Array(4)].map((e, key) => <ProductLoadAnim key={key} />)}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
