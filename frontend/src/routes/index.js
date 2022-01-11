import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
// import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import AuthLockScreen from "../pages/Authentication/AuthLockScreen";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

// Pages Calendar
import Calendar from "../pages/Calendar/Calendar";

// Pages Component
import Chat from "../pages/Chat/Chat";

//Ecommerce Pages
import EcommerceProducts from "../pages/Ecommerce/EcommerceProducts/index"
import EcommerceProductDetail from "../pages/Ecommerce/EcommerceProducts/EcommerceProductDetail"
import EcommerceOrders from "../pages/Ecommerce/EcommerceOrders/index"
import EcommerceCustomers from "../pages/Ecommerce/EcommerceCustomers/index"
import EcommerceCart from "../pages/Ecommerce/EcommerceCart"
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout"
import EcommerceShops from "../pages/Ecommerce/EcommerceShops/index"
import EcommerceAddProduct from "../pages/Ecommerce/EcommerceAddProduct"

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";

// Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import SparklineChart from "../pages/Charts/SparklineChart";
import ChartsKnob from "../pages/Charts/jquery-knob";

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";
import MapsVector from "../pages/Maps/MapsVector";

//Icons
import RemixIcons from "../pages/Icons/RemixIcons";
import MaterialDesign from "../pages/Icons/MaterialDesign";
import DripiIcons from "../pages/Icons/DripiIcons";
import FontAwesome from "../pages/Icons/FontAwesome";

//Utility
import StarterPage from "../pages/Utility/StarterPage";
import Maintenance from "../pages/Utility/Maintenance";
import CommingSoon from "../pages/Utility/CommingSoon";
import Timeline from "../pages/Utility/Timeline";
import FAQs from "../pages/Utility/FAQs";
import Pricing from "../pages/Utility/Pricing";
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

// Forms
import FormElements from "../pages/Forms/FormElements";
import FormAdvanced from "../pages/Forms/FormAdvanced";
import FormEditors from "../pages/Forms/FormEditors";
import FormValidations from "../pages/Forms/FormValidations";
import FormMask from "../pages/Forms/FormMask";
import FormUpload from "../pages/Forms/FormUpload";
import FormWizard from "../pages/Forms/FormWizard";
import FormXeditable from "../pages/Forms/FormXeditable";

//Ui
import UiAlert from "../pages/Ui/UiAlert";
import UiButtons from "../pages/Ui/UiButtons";
import UiCards from "../pages/Ui/UiCards";
import UiCarousel from "../pages/Ui/UiCarousel";
import UiDropdown from "../pages/Ui/UiDropdown";
import UiGeneral from "../pages/Ui/UiGeneral";
import UiGrid from "../pages/Ui/UiGrid";
import UiImages from "../pages/Ui/UiImages";
import UiLightbox from "../pages/Ui/UiLightbox";
import UiModal from "../pages/Ui/UiModal";
import UiProgressbar from "../pages/Ui/UiProgressbar";
import UiSweetAlert from "../pages/Ui/UiSweetAlert";
import UiTabsAccordions from "../pages/Ui/UiTabsAccordions";
import UiTypography from "../pages/Ui/UiTypography";
import UiVideo from "../pages/Ui/UiVideo";
import UiSessionTimeout from "../pages/Ui/UiSessionTimeout";
import UiRating from "../pages/Ui/UiRating";
import UiRangeSlider from "../pages/Ui/UiRangeSlider";
import UiNotifications from "../pages/Ui/ui-notifications";
import UIRoundSlider from "../pages/Ui/UIRoundSlider";

//Tables
import BasicTables from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";
import EditableTables from "../pages/Tables/EditableTables";

// Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Register1 from "../pages/AuthenticationInner/Register";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";

//Kanban Board
import KanbanBoard from "../pages/KanbanBoard/index";

// MOTEL
import Habitaciones from '../pages/Habitaciones'
import HabitacionesCheckout from '../pages/Habitaciones/CheckOut'
import HabitacionesEdit from '../pages/Habitaciones/Editar'
import Inventario from '../pages/Inventario'
import Bodega from '../pages/Bodega'
import Registros from '../pages/Registros'
import Caja from '../pages/Caja'
import Login from "../pages/Login";

const authProtectedRoutes = [

    // Motel
    { path: '/habitaciones/:id/check-out', component: HabitacionesCheckout },
    { path: '/habitaciones/:id/editar', component: HabitacionesEdit },
    { path: '/habitaciones', component: Habitaciones },

    { path: '/inventario', component: Inventario },
    { path: '/bodega', component: Bodega },
    { path: '/registros', component: Registros },
    { path: '/caja', component: Caja },

    { path: "/dashboard", component: Dashboard },


    //Kanban Board
    { path: "/kanban-board", component: KanbanBoard },

    // Tables
    { path: "/basic-tables", component: BasicTables },
    { path: "/datatable-table", component: DatatableTables },
    { path: "/responsive-table", component: ResponsiveTables },
    { path: "/editable-table", component: EditableTables },

    // Ui
    { path: "/ui-alerts", component: UiAlert },
    { path: "/ui-buttons", component: UiButtons },
    { path: "/ui-cards", component: UiCards },
    { path: "/ui-carousel", component: UiCarousel },
    { path: "/ui-dropdowns", component: UiDropdown },
    { path: "/ui-general", component: UiGeneral },
    { path: "/ui-grid", component: UiGrid },
    { path: "/ui-images", component: UiImages },
    { path: "/ui-lightbox", component: UiLightbox },
    { path: "/ui-modals", component: UiModal },
    { path: "/ui-progressbars", component: UiProgressbar },
    { path: "/ui-sweet-alert", component: UiSweetAlert },
    { path: "/ui-tabs-accordions", component: UiTabsAccordions },
    { path: "/ui-typography", component: UiTypography },
    { path: "/ui-video", component: UiVideo },
    { path: "/ui-session-timeout", component: UiSessionTimeout },
    { path: "/ui-rating", component: UiRating },
    { path: "/ui-rangeslider", component: UiRangeSlider },
    { path: "/ui-notifications", component: UiNotifications },
    { path: "/ui-roundslider", component: UIRoundSlider },

    // Forms
    { path: "/form-elements", component: FormElements },
    { path: "/form-advanced", component: FormAdvanced },
    { path: "/form-editors", component: FormEditors },
    { path: "/form-mask", component: FormMask },
    { path: "/form-file-upload", component: FormUpload },
    { path: "/form-wizard", component: FormWizard },
    { path: "/form-validation", component: FormValidations },
    { path: "/form-xeditable", component: FormXeditable },

    //Utility
    { path: "/starter", component: StarterPage },
    { path: "/timeline", component: Timeline },
    { path: "/faqs", component: FAQs },
    { path: "/pricing", component: Pricing },

    //Icons
    { path: "/icons-remix", component: RemixIcons },
    { path: "/material-design", component: MaterialDesign },
    { path: "/dripicons", component: DripiIcons },
    { path: "/font-awesome-5", component: FontAwesome },

    // Maps
    { path: "/google-maps", component: MapsGoogle },
    { path: "/vector-maps", component: MapsVector },

    //Charts
    { path: "/apex-charts", component: ChartApex },
    { path: "/chartjs", component: ChartjsChart },
    { path: "/charts-sparkline", component: SparklineChart },
    { path: "/charts-knob", component: ChartsKnob },

    //Email
    { path: "/email-inbox", component: EmailInbox },
    { path: "/email-read", component: EmailRead },

    //Ecommerce

    { path: "/ecommerce-products", component: EcommerceProducts },
    { path: "/ecommerce-product-detail/:id", component: EcommerceProductDetail },
    { path: "/ecommerce-orders", component: EcommerceOrders },
    { path: "/ecommerce-customers", component: EcommerceCustomers },
    { path: "/ecommerce-cart", component: EcommerceCart },
    { path: "/ecommerce-checkout", component: EcommerceCheckout },
    { path: "/ecommerce-shops", component: EcommerceShops },
    { path: "/ecommerce-add-product", component: EcommerceAddProduct },

    //chat
    { path: "/chat", component: Chat },

    //calendar
    { path: "/calendar", component: Calendar },

    // this route should be at the end of all other routes
    { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }
];

const publicRoutes = [
    // { path: "/logout", component: Logout },
    { path: "/login", component: Login },
    // { path: "/forgot-password", component: ForgetPwd },
    // { path: "/register", component: Register },
    // { path: "/lock-screen", component: AuthLockScreen },

    // // Authentication Inner
    // { path: "/auth-login", component: Login1 },
    // { path: "/auth-register", component: Register1 },
    // { path: "/auth-recoverpw", component: ForgetPwd1 },

    // { path: "/maintenance", component: Maintenance },
    // { path: "/comingsoon", component: CommingSoon },
    { path: "/404", component: Error404 },
    { path: "/500", component: Error500 },
];

export { authProtectedRoutes, publicRoutes };
