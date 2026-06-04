import MaqaraatForm from "../_components/maqarat/MaqaraatForm";
import MaqaratContainer from "../_components/maqarat/MaqaratContainer"
import MaqaratFilter from "../_components/maqarat/MaqaratFilter";
import MaqaratHeader from "../_components/maqarat/MaqaratHeader"

async function Page({searchParams}) {
    const query = await searchParams;
    console.log(query)
    return (
      <div className="p-2 h-full">
        <MaqaratHeader />
        {/* {/* <MaqaraatForm /> */}
        <div className="flex justify-between mt-5 items-center">
          <h1 className="font-bold">Past Maqarat Sessions</h1>
          <MaqaratFilter query={query} />
        </div>
          <MaqaratContainer query={query} /> 
      </div>
    );
}

export default Page
