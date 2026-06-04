import StudentsContainer from "../_components/students/StudentsContainer";
import Redirect from "../_components/auth/Redirect";

async function Page() {
 
    return (
        <div className="h-full px-5">
          <Redirect unauthorizedRole={['student']}/>
            <StudentsContainer />
          </div>
    );
}

export default Page
