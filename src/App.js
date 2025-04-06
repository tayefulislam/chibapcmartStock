import { Route, Routes } from "react-router-dom";
import "./App.css";
import CreateNewOrder from "./Pages/Admin/Order/CreateNewOrder";
import OrderLists from "./Pages/Admin/Order/OrderLists";
import UpdateOrderDetails from "./Pages/Admin/Order/UpdateOrderDetails";
import OrderDetails from "./Pages/Admin/Order/OrderDetails";
import Home from "./Pages/Home/Home";
import Header from "./Shared/MenuBar/MenuBar";
import NewStock from "./Pages/Inventory/NewStock";
import SelectSupplier from "./Pages/Inventory/SelectSupplier";
import CreateNewSupplier from "./Pages/Inventory/CreateNewSupplier";
import SelectItems from "./Pages/Inventory/ITEMS/SelectItems";
import CreateNewItems from "./Pages/Inventory/ITEMS/CreateNewItems";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/orderLists" element={<OrderLists />}></Route>
        <Route path="/createNewOrder" element={<CreateNewOrder />}></Route>
        <Route
          path="/updateOrderDetails/:orderId"
          element={<UpdateOrderDetails />}
        ></Route>

        <Route path="/orderDetails/:orderId" element={<OrderDetails />}></Route>

        {/* Items */}

        <Route
          path="/items/NewItem"
          element={<CreateNewItems></CreateNewItems>}
        ></Route>

        {/* Stock */}

        <Route
          path="/newStock/CreateNewStock/:stockOrderId/:supplierId/:itemId"
          element={<NewStock />}
        ></Route>

        <Route
          path="/newStock/selectSupplier"
          element={<SelectSupplier />}
        ></Route>

        <Route
          path="/newStock/CreateNewSupplier"
          element={<CreateNewSupplier></CreateNewSupplier>}
        ></Route>

        <Route
          path="/newStock/CreateNewStock/:stockOrderId/:supplierId"
          element={<SelectItems></SelectItems>}
        ></Route>
      </Routes>

      <div className="py-[30px]"></div>

      <Header></Header>
    </div>
  );
}

export default App;
