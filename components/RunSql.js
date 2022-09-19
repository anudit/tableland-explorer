import React, { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { connect } from "@tableland/sdk";

const NavBar = () => {

  const [tableland, setTableland] = useState(null);

  useEffect(()=>{
    async function setup(){
      const connection = await connect({ network: "testnet", chain: "polygon-mumbai" });
      setTableland(connection);
    }
    setup();
  },[])

  const onChangeSql = async (event) => {
    try {
      const hashRes = await tableland.hash(event.target.value);
      console.log(hashRes, event.target.value);

    } catch (error) {
      console.log(error.message, event.target.value);
    }
  }

  return (
      <Input placeholder='Run SQL' size='sm' onChange={onChangeSql} maxWidth="200px"/>
  );
};

export default NavBar;
