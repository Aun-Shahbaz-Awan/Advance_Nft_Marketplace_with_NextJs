import React, { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
// Blockcain
import { ethers } from "ethers";
// import Web3Modal from "web3modal";
import detectEthereumProvider from "@metamask/detect-provider";
// React-Icons
import { IoMdArrowDropdown } from "react-icons/io";
import { FcAbout } from "react-icons/fc";
import { BiDetail } from "react-icons/bi";
import { CgDetailsMore } from "react-icons/cg";
import { MdOutlineAutoGraph, MdOutlineContentCopy } from "react-icons/md";
import { RiArrowUpSFill } from "react-icons/ri";
import { AiFillTag, AiOutlineUnorderedList } from "react-icons/ai";
import { FaWallet } from "react-icons/fa";
import { SiEthereum } from "react-icons/si";
// Components
import ListingTable from "./ProductTableList";
import { MarketAddress } from "../../config";
import Market from "./../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

const ProductDetail = () => {
  // Fetching Slug(Url)
  const router = useRouter();
  const { contract, id, price } = router.query;
  // useState
  const [token, setToken] = useState(""); // Token[NFT Details] Object
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenOwner, setTokenOwner] = useState("");
  const [transactions, setTransactions] = useState("");
  // Dropdown for Sections
  const [descriptionSec, openDescriptionSec] = useState(true);
  const [aboutSec, openAboutSec] = useState(false);
  const [detailSec, openDetailSec] = useState(false);
  const [historySec, openHistorySec] = useState(true);
  const [listingSec, openListingSec] = useState(false);
  const [offerSec, openOfferSec] = useState(false);
  // Get Signer(wallet i.e. user) Address
  const getSigner = async () => {
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // const signer = provider.getSigner();
    const connection = window.ethereum ? window.ethereum : "";
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    await signer.getAddress().then((data) => {
      setWalletAddress(data);
    });
  };
  getSigner();
  // Handle Buying NFTs
  const handleBuyNft = async () => {
    console.log("price:", price);
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();

    const contract = new ethers.Contract(MarketAddress, Market.abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */

    // const price;
    // setTimeout(price = ethers.utils.parseUnits(price.toString(), 'ether'), 3000);
    // const price = ethers.utils.parseUnits(price.toString(), 'ether')
    // console.log("Address:", NFTAddress, "ItemId:", nft.itemId, "Price:", price )
    const transaction = await contract.createMarketSale(contract, id, {
      value: price,
    });
    await transaction.wait();
    router.push("/my-assets");
  };
  // Create Sale Item on marketplace...
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
          setTokenOwner(response.data.owner.address);
        })
        .catch(function (error) {
          console.error(error);
        });
      // Fetch Transaction deatils
      options = {
        method: "GET",
        url: "https://rinkeby-api.opensea.io/api/v1/events",
        params: {
          asset_contract_address: "0xF4F841d9e28e89F1923dc1FF209ED0Ce147e16Ff",
          token_id: "8",
          only_opensea: "false",
          offset: "0",
          limit: "20",
        },
        headers: {
          Accept: "application/json",
        },
      };
      axios
        .request(options)
        .then((response) => {
          setTransactions(response.data);
          console.log("Responce", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      // const responce = await axios.request(options)
      // const transactionDetails = await Promise.all(
      //     response.data.asset_events.map( async dataItem => {
      //         return dataItem.transaction
      //     })
      // )
      // setTransactions(transactionDetails)
    };
    fetchDetails();
  }, [contract, id]);

  // console.log('Owner:', token.owner?.address, "wallet:", walletAddress)
  return (
    <React.Fragment>
      <div className="md:flex items-start justify-center py-12 2xl:px-30 md:px-20 px-4">
        {/* Left Section */}
        <div className="md:w-5/12 lg:mr-7 lg:mb-0">
          {/* Image */}

          <div className="bg-white shadow rounded">
            {/* <Image width='500' height="500" objectFit='contain' className="w-full" alt="image of a girl posing" src="https://i.ibb.co/QMdWfzX/component-image-one.png" /> */}
            <img
              src={token.image_original_url ? token.image_original_url : ""}
            />
          </div>
          {/* Details */}
          <div className="py-5">
            {/* Description */}
            <div
              onClick={() => openDescriptionSec(!descriptionSec)}
              className="flex items-center justify-between p-4 shadow rounded text-lg font-bold text-gray-800 cursor-pointer"
            >
              <span className="flex items-center">
                {" "}
                <CgDetailsMore className="mr-2" /> Description{" "}
              </span>{" "}
              {descriptionSec ? <RiArrowUpSFill /> : <IoMdArrowDropdown />}
            </div>
            {descriptionSec && (
              <div className="mt-2 p-5 bg-white shadow rounded">
                <p className="text-gray-500 pb-3">
                  Create by:{" "}
                  <span className="text-indigo-600">
                    {token.creator?.address ? token.creator.address : ""}
                  </span>
                </p>
                {token.description ? token.description : ""}
              </div>
            )}
            {/* About */}
            <div
              onClick={() => openAboutSec(!aboutSec)}
              className="flex items-center justify-between p-4 shadow rounded text-lg font-bold text-gray-800 cursor-pointer"
            >
              <span className="flex items-center">
                {" "}
                <FcAbout className="mr-2 text-gray-800" /> About{" "}
              </span>{" "}
              {aboutSec ? <RiArrowUpSFill /> : <IoMdArrowDropdown />}
            </div>
            {aboutSec && (
              <div className="mt-2 p-5 bg-white shadow rounded">
                {token.collection.description
                  ? token.collection.description
                  : "This collection has no description yet. Contact the owner of this collection about setting it up!"}
              </div>
            )}
            {/* Details */}
            <div
              onClick={() => openDetailSec(!detailSec)}
              className="flex items-center justify-between p-4 shadow rounded text-lg font-bold text-gray-800 cursor-pointer"
            >
              <span className="flex items-center">
                {" "}
                <BiDetail className="mr-2" /> Detail{" "}
              </span>{" "}
              {aboutSec ? <RiArrowUpSFill /> : <IoMdArrowDropdown />}
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
                        navigator.clipboard.writeText(
                          token.asset_contract.address
                        )
                      }
                    />
                    <p className="text-base leading-3 text-right text-indigo-700">
                      {token.asset_contract.address
                        ? token.asset_contract.address
                            .slice(0, 6)
                            .concat("...")
                            .concat(token.asset_contract.address.slice(-4))
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4 mx-2">
                  <p className="text-base leading-normal text-gray-800">
                    Token ID
                  </p>
                  <p className="text-base leading-3 text-right text-gray-500">
                    {token.token_id}
                  </p>
                </div>
                <div className="flex items-center justify-between pb-4 mx-2">
                  <p className="text-base leading-normal text-gray-800">
                    Token Standard
                  </p>
                  <p className="text-base leading-3 text-right text-gray-500">
                    {token.asset_contract.schema_name}
                  </p>
                </div>
                <div className="flex items-center justify-between  mx-2">
                  <p className="text-base leading-normal text-gray-800">
                    Blockchain
                  </p>
                  <p className="text-base leading-3 text-right text-gray-500">
                    _____
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Right Section */}
        <div className="md:w-7/12 lg:ml-8 md:ml-6 md:mt-0 mt-6">
          <div className="pb-3 flex justify-between">
            <div>
              {console.log("Token:", token)}
              <h5 className="leading-none text-gray-600">
                {token?.collection?.name ? token?.collection?.name : ""}
              </h5>
              <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2 ">
                {token.name ? token.name : ""}
              </h1>
            </div>
            {tokenOwner.toUpperCase() === walletAddress.toUpperCase() ? (
              <Link href={`/assets/${contract}/${id}/sell`}>
                <button className="my-auto w-52 rounded font-bold flex items-center justify-center leading-none focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-800  text-white bg-indigo-600 p-4 hover:bg-indigo-700">
                  Sell
                </button>
              </Link>
            ) : (
              ""
            )}
            {/* </Link> */}
          </div>
          <p className="pb-6 text-gray-600 flex">
            Owned by:{" "}
            <span className="text-indigo-700 flex items-center ml-1">
              {token?.owner?.address.toUpperCase() ===
              walletAddress.toUpperCase()
                ? "You"
                : token?.owner?.address}
              <MdOutlineContentCopy
                className="ml-2 cursor-pointer"
                onClick={() =>
                  navigator.clipboard.writeText(token?.owner?.address)
                }
              />
            </span>
          </p>
          {/* Buy or Bid */}
          {tokenOwner.toUpperCase() === walletAddress.toUpperCase() ? (
            ""
          ) : (
            <div className="my-2 p-6 border rounded font-semibold leading-none text-gray-800 flex-col items-center  cursor-pointer bg-blue-50">
              {/* <button className=" w-1/2 p-4 mb-6 rounded font-blod flex items-center justify-center leading-none bg-white ring-1 ring-offset-1 ring-indigo-600 text-indigo-600 focus:outline-none focus:ring-indigo-800 hover:shadow-xl">
                                Make Offer
                            </button> */}
              <p>Current Price</p>
              <h1 className="mb-6 my-1 text-4xl flex items-center">
                {" "}
                <SiEthereum className="text-3xl " />
                {price ? price : "__"}
              </h1>
              <div className="flex">
                <button
                  onClick={() => handleBuyNft()}
                  className="my-auto mr-6 w-52 rounded font-bold flex items-center justify-center leading-none focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-800  text-white bg-indigo-600 p-4 hover:bg-indigo-700"
                >
                  <FaWallet className="mr-2" /> Buy
                </button>
                {/* <button className="my-auto w-52 p-4 rounded font-bold flex items-center justify-center leading-none bg-white ring-1 ring-offset-1 ring-indigo-600 text-indigo-600 focus:outline-none focus:ring-indigo-800 hover:shadow-xl">
                                        <AiFillTag className="mr-2"/> Offer
                                    </button> */}
              </div>
            </div>
          )}

          {/* Price Historys */}
          <div
            onClick={() => openHistorySec(!historySec)}
            className="my-2 p-6 border rounded bg-white font-bold leading-none text-gray-800 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                {" "}
                <MdOutlineAutoGraph className="mr-2" /> Price History{" "}
              </span>{" "}
              {historySec ? <RiArrowUpSFill /> : <IoMdArrowDropdown />}
            </div>
            {historySec && (
              <div className="p-4 mt-6 bg-blue-50 shadow rounded">
                ________________________________________
                ________________________________________
                ________________________________________
              </div>
            )}
          </div>
          {/* Listings */}
          <div
            onClick={() => openListingSec(!listingSec)}
            className="my-2 p-6 border rounded bg-white font-bold leading-none text-gray-800 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                {" "}
                <AiFillTag className="mr-2" /> Listing{" "}
              </span>{" "}
              {listingSec ? <RiArrowUpSFill /> : <IoMdArrowDropdown />}
            </div>
            {listingSec && <div className="mt-6 ">{<ListingTable />}</div>}
          </div>
          {/* Offers */}
          <div
            onClick={() => openOfferSec(!offerSec)}
            className="my-2 p-6 border rounded bg-white font-bold leading-none text-gray-800 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                {" "}
                <AiOutlineUnorderedList className="mr-2" /> Offers{" "}
              </span>{" "}
              {offerSec ? <RiArrowUpSFill /> : <IoMdArrowDropdown />}
            </div>
            {offerSec && (
              <div className="p-4 mt-6 bg-blue-50 shadow rounded">
                __________________________________________________________
                _______________________________________________________
                ___________________________________________________
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Event Logs*/}
      <div className="flex flex-col pb-12 2xl:px-30 md:px-20 px-4">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions?.asset_events?.map((transaction) => (
                    <tr key={transaction.transaction.from_account.address}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-indigo-700">
                          {transaction?.transaction?.from_account?.address
                            .slice(2, 8)
                            .toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-indigo-700">
                          {transaction?.transaction?.to_account?.address
                            .slice(2, 8)
                            .toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {transaction?.created_date.slice(0, 10)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductDetail;
