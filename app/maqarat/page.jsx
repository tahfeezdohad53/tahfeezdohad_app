import { CiViewList } from "react-icons/ci";
import MaqaraatForm from "../_components/maqarat/MaqaraatForm";
import MaqaratContainer from "../_components/maqarat/MaqaratContainer"
import MaqaratFilter from "../_components/maqarat/MaqaratFilter";
import MaqaratHeader from "../_components/maqarat/MaqaratHeader"

async function Page({searchParams}) {
    // const query = await searchParams;
    // console.log(query)
    return (
      <div className="p-3  ">
        <MaqaratHeader />
        {/* {/* <MaqaraatForm /> */}
        
        <MaqaratContainer />
      </div>
    );
}

export default Page
