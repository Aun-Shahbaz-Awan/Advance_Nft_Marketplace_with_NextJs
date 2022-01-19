import React, { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import axios from "axios";
// React-Icons
import { IoMdArrowDropdown } from "react-icons/io";
import { FcAbout } from "react-icons/fc";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiArrowUpSFill } from "react-icons/ri";
import { MdArrowBackIos } from "react-icons/md";
// Blockchian
import { ethers } from "ethers";
// import Web3Modal from "web3modal";
import detectEthereumProvider from "@metamask/detect-provider";
import { MarketAddress } from "../../config";
// Contract ABI
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const ProductSell = () => {
  const router = useRouter();
  const { contract, id } = router.query;
  // Dropdown for Sections
  const [detailSec, openDetailSec] = useState(true);

  // useState
  const [token, setToken] = useState("");
  const [price, setPrice] = useState("");
  // Create Market Item on marketplace...
  const handleLisingItem = async (event) => {
    console.log("Trigger Handle Listing...");
    event.preventDefault();
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    // const signer = provider.getSigner();
    console.log("Signer:", signer);
    const MKPContract = new ethers.Contract(MarketAddress, Market.abi, signer); // contract -> Marketplace Contract
    console.log("MKP Contract:", MKPContract);
    let listingPrice = await MKPContract.getListingPrice(); // getListingPrice is Function from NFTMarket - Contract
    listingPrice = listingPrice.toString();
    const sellPrice = ethers.utils.parseUnits(price, "ether");

    console.log(
      "Contract:",
      contract,
      "TokenID:",
      id,
      "Sell Price:",
      sellPrice,
      "Listing Price:",
      listingPrice
    );
    // Listing Item for sale on MarketPlace -------------------
    let transaction = await MKPContract.createMarketItem(
      contract,
      id,
      sellPrice,
      { value: listingPrice }
    );
    const tx = await transaction.wait(); // wait for transaction to complete...
    console.log("Transection:", tx);
    router.push("/");
  };
  useEffect(() => {
    if (!contract && !id) {
      return;
    }
    const fetchDetails = async () => {
      const options = {
        method: "GET",
        url: `https://rinkeby-api.opensea.io/api/v1/asset/${contract}/${id}/`,
      };
      await axios
        .request(options)
        .then(function (response) {
          setToken(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    };
    fetchDetails();
  }, [contract, id]);

  return (
    <div className="md:flex items-start justify-center py-12 2xl:px-40 md:px-30 px-4 min-h-screen">
      {/* Left Section */}
      <div className="md:w-8/12 lg:mr-20 md:mr-16 md:mt-0 mt-6">
        <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2 ">
          <span className="flex">
            <MdArrowBackIos /> Back
          </span>
        </h1>
        <h1 className="my-8 lg:text-3xl text-2xl font-bold lg:leading-6 leading-7 text-gray-800">
          List item for sale
        </h1>
        {/* Details */}
        <div className="my-2 p-5 bg-white shadow rounded">
          {/* Price */}
          <p className="font-bold mb-2">Price</p>
          <div className="flex">
            <div className="flex items-center px-8 mr-4 border border-indigo-700 rounded-md">
              Ethers
            </div>
            <input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
              placeholder="Amount"
            />
          </div>
          {/* Duration */}
          <p className="font-bold mt-4 mb-2">Duration</p>
          <input
            disabled
            id="price"
            className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
          />
        </div>
        {/* Listing */}
        <button
          onClick={(event) => handleLisingItem(event)}
          className="my-8 w-52 rounded font-bold flex items-center justify-center leading-none focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-800  text-white bg-indigo-600 p-4 hover:bg-indigo-700 float-right"
        >
          Complete Listing
        </button>
      </div>

      {/* Right Section */}
      <div className="md:w-4/12 lg:ml-7 lg:mb-0">
        {/* Image */}
        <div className=" bg-white shadow rounded  w-full">
          {/* <Image width='500' height="500" objectFit='contain' className="w-full" alt="image of a girl posing" src="https://i.ibb.co/QMdWfzX/component-image-one.png" /> */}
          <span className="z-10 px-2 m-2 text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
            {token?.name}
          </span>
          <img
            src={token.image_original_url ? token.image_original_url : ""}
            alt={token?.name}
          />
          <div className="flex justify-between p-2"></div>
        </div>
        {/* Details */}
        <div
          onClick={() => openDetailSec(!detailSec)}
          className="flex items-center justify-between p-4 shadow rounded text-lg font-bold text-gray-800 cursor-pointer"
        >
          <span className="flex items-center">
            {" "}
            <FcAbout className="mr-2 text-gray-800" /> About{" "}
          </span>{" "}
          {detailSec ? <RiArrowUpSFill /> : <IoMdArrowDropdown />}
        </div>
        {detailSec && (
          <div className="mt-2 p-5 bg-white shadow rounded">
            <div className="flex items-center justify-between pb-4 mx-2">
              <p className="text-base leading-normal text-gray-800">
                Contract Address
              </p>
              <div className="flex text-indigo-700 items-center">
                <MdOutlineContentCopy
                  className="mr-2 cursor-pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(token.asset_contract.address)
                  }
                />
                <p className="text-base leading-3 text-right text-indigo-700">
                  {token.asset_contract?.address
                    ? token.asset_contract?.address
                        .slice(0, 6)
                        .concat("...")
                        .concat(token.asset_contract.address.slice(-4))
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pb-4 mx-2">
              <p className="text-base leading-normal text-gray-800">Token ID</p>
              <p className="text-base leading-3 text-right text-gray-500">
                {token.token_id}
              </p>
            </div>
            <div className="flex items-center justify-between pb-4 mx-2">
              <p className="text-base leading-normal text-gray-800">
                Collection
              </p>
              <p className="text-base leading-3 text-right text-gray-500">
                {token.asset_contract?.name}
              </p>
            </div>
            <div className="flex items-center justify-between mx-2">
              <p className="text-base leading-normal text-gray-800">
                Token Standard
              </p>
              <p className="text-base leading-3 text-right text-gray-500">
                {token.asset_contract?.schema_name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSell;
