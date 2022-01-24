import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
// Contracts Address
import { NFTAddress, MarketAddress } from "../../config";
// Contarcts ABI's
import Market from "./../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "./../../artifacts/contracts/NFT.sol/NFT.json";
// Component
import Product from "../../components/single-components/Product";
import ProductLoadAnim from "../../components/single-components/ProductLoadAnim";

export default function CreatorDashboard() {
  // useState Hook
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [signer, setSigner] = useState("");
  // Function
  const loadNFTs = async () => {
    const marketContract = new ethers.Contract(
      MarketAddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(NFTAddress, NFT.abi, provider);

    const itemsCreated = await marketContract.fetchItemsCreated();
    const items = await Promise.all(
      itemsCreated.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let item = {
          tokenId: i.tokenId.toNumber(),
          owner: i.owner,
          seller: i.seller,
          sold: i.sold,
          price: ethers.utils.formatUnits(i.price.toString(), "ether"),
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    // Remove dublicate array
    const filteredItem = items.reduce((acc, current) => {
      const x = acc.find((item) => item.tokenId === current.tokenId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    setNfts(filteredItem);
    // Filtered array of items that have been sold
    const soldItems = items.filter((i) => i.sold);
    // Remove dublicate array
    const filteredSoldItem = soldItems.reduce((acc, current) => {
      const x = acc.find((item) => item.tokenId === current.tokenId);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    setSold(filteredSoldItem);
    setLoaded(true);
  };
  // useEffect Hook
  useEffect(() => {
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
    loadNFTs();
  }, [nfts.length, sold.length]);
  if (loaded && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No assets created</h1>;
  return (
    <React.Fragment>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Heading */}
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Items Created
          </h2>
          {/* Products */}
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {loaded
              ? nfts?.map((nft, key) => <Product product={nft} key={key} />)
              : [...Array(4)].map((e, key) => <ProductLoadAnim key={key} />)}
          </div>
        </div>
      </div>

      {Boolean(sold.length) && (
        <div className="bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* Heading */}
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Items Sold
            </h2>
            {/* Products */}
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {sold?.map((nft, key) => (
                <Product product={nft} key={key} />
              ))}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
