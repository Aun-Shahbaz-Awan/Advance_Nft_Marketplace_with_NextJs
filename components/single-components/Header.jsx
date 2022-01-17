import {useState} from "react"
import Link from "next/link"
import { GiFrozenBlock } from "react-icons/gi";
import { IoMdAddCircle } from "react-icons/io";
import Router from 'next/router'
import axios from "axios";
// import { useMoralis } from "react-moralis";
// import { ethers } from "ethers"
// import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
// import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
// import {NFTAddress, MarketAddress} from "../../config"

const Header = () => {
    // const opensea_api = '44d6942150114ae182d13de8f03ba2a7'
    // this will work >> https://rinkeby-api.opensea.io/graphql/
    const [search, setSearch] = useState("");

    // Handle Search Event
    const handleSearch = async(event) => {
        console.log(search.slice(0,2))
        if (search.slice(0,2) === '0x')
            () => {}
        else Router.push(`/collection/${search}`)
        event.preventDefault();
    }

    return (
    <div className="bg-indigo-600 m-3 rounded-lg">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">

                <div className="w-0 flex-1 flex items-center">
                    <span className="flex p-2 rounded-lg bg-indigo-800">
                        <GiFrozenBlock className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                    <div className="ml-3 hidden md:inline rounded-md shadow-sm items-center w-8/12 ">
                        <form onSubmit={(event) => handleSearch(event)}>
                            <input 
                                value={search} 
                                onChange={ event => setSearch(event.target.value)} 
                                name="search" id="search" type="text" className="focus:ring-indigo-500 focus:border-indigo-500 block pl-7 pr-12 lg:text-sm h-10 w-full pt-1 pb-1 border-gray-300 rounded-md" placeholder="Search items, collections and accounts"
                            />
                            <input type="submit" hidden></input>
                        </form>
                    </div>

                </div>

                {/* Marketplace NFT's */}
                <div className="order-1 flex-shrink-0 sm:order-1 sm:ml-3">
                    <Link href='/'>
                        <button type="button" className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                            <strong className="text-white">Explore</strong>
                        </button>
                    </Link>
                </div>

                <div className="order-1 flex-shrink-0 sm:order-2 sm:ml-3">
                    <Link href='/creater-dashboard'>
                        <button type="button" className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                            <strong className="text-white">Creater Dashboard</strong>
                        </button>
                    </Link>
                </div>
                {/* */}
                <div className="order-1 flex-shrink-0 sm:order-3 sm:ml-3">
                    <Link href='/my-assets'>
                        <button type="button" className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                            <strong className="text-white">My Collection</strong>
                        </button>
                    </Link>
                </div>
                {/* Create NFT */}
                <div className="order-1 mt-2 ml-4 flex-shrink-0 w-full sm:order-4 sm:mt-0 sm:w-auto">
                    <Link href='/create'>
                        <a href="#" className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                            <IoMdAddCircle className="h-4 w-4 text-indigo-600" aria-hidden="true" />&nbsp; Create
                        </a>
                    </Link>
                </div>

            </div>
        </div>
    </div>
    )
}
export default Header;

