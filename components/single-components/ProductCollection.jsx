import React, { useState, useEffect } from "react";
import axios from "axios";
import Product from "./Product";
import ProductLoadAnim from "./ProductLoadAnim";
import { useRouter } from "next/dist/client/router";
const ProductCollection = () => {
  // Fetching Slug(Url)
  const router = useRouter();
  const { slug } = router.query;
  // useStates
  const [stats, setStats] = useState("");
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  console.log("Slug:", slug);

  useEffect(() => {
    if (!slug) {
      return;
    }
    const fetchCollectionStats = async () => {
      const options = {
        method: "GET",
        url: `https://rinkeby-api.opensea.io/api/v1/collection/keto/stats`,
        headers: { Accept: "application/json" },
      };
      axios
        .request(options)
        .then((response) => {
          setStats(response.data.stats);
        })
        .catch(function (error) {
          console.error(error);
        });
    };
    const fetchCollection = async () => {
      const options = {
        method: "GET",
        url: `https://rinkeby-api.opensea.io/api/v1/assets`,
        params: {
          order_direction: "asc",
          offset: "0",
          limit: "20",
          collection: slug[0],
        },
      };
      await axios
        .request(options)
        .then(function (response) {
          setNfts(response.data);
          console.log(" Slgooo: ", slug);
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    };
    fetchCollection();
    fetchCollectionStats();
    return () => {
      setLoaded(true);
    };
  }, [slug]);

  return (
    <React.Fragment>
      <div className="flex items-center justify-center bg-indigo-400 h-48 m-3 p-4 rounded-lg">
        <div className=" bg-indigo-400 rounded-full border-2 h-36 w-36 relative top-24"></div>
      </div>
      <div className="flex-col items-center justify-center  text-center  p-4 mt-16">
        <h1 className="text-4xl font-bold">Keto</h1>
        <p className="text-gray-500">
          Welcome to the home of __Keto__. Discover the best items in this
          collection.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center text-center p-4">
        <div className="py-3 px-6 min-w-34 border border-gray-500 rounded-tl-lg rounded-bl-lg">
          <h2 className="text-2xl font-semibold">{stats?.count}</h2>
          <p className="text-gray-500 w-28">items</p>
        </div>
        <div className="border-t border-b border-r border-gray-500 py-3 px-6">
          <h2 className="text-2xl font-semibold">{stats?.num_owners}</h2>
          <p className="text-gray-500 w-28">owners</p>
        </div>
        <div className="border-t border-b border-gray-500 py-3 px-6">
          <h2 className="text-2xl font-semibold">{stats?.floor_price}</h2>
          <p className="text-gray-500 w-28">floor price</p>
        </div>
        <div className="border border-gray-500 py-3 px-6 rounded-tr-lg rounded-br-lg">
          <h2 className="text-2xl font-semibold">{stats?.total_volume}</h2>
          <p className="text-gray-500 w-28">volume traded</p>
        </div>
      </div>
      {/* Products */}
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {loaded
            ? nfts.assets.map((nft, key) => <Product product={nft} key={key} />)
            : [...Array(4)].map((e, key) => <ProductLoadAnim key={key} />)}
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductCollection;
