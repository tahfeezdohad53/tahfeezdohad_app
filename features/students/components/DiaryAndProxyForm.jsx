import Modal from "@/app/_components/Modal";
import CustomSelect from "@/app/_components/Select";
import { FaBookOpen, FaChalkboardTeacher, FaShieldAlt, FaUser, FaUserCheck, FaUserShield } from "react-icons/fa";

function DiaryAndProxyForm() {
    return (
      <Modal
        onClose={() => setModal({ show: false, type: "" })}
        className="w-[90%] h-fit rounded-2xl"
        headingStyles="text-xl font-bold text-center"
        
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            {/* Icon Circle */}
            <div className="p-4 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shadow-sm border border-amber-100">
              {modal.type === "diary" ? (
                <FaBookOpen className="text-3xl text-amber-700" />
              ) : (
                <FaUserShield className="text-3xl text-amber-700" />
              )}
            </div>

            {/* Heading */}
            <h2 className="mt-5 lg:text-2xl font-bold text-[var(--text-primary)] text-center">
              {modal.type === "diary"
                ? "Select teacher to change diary"
                : "Select teacher to assign proxy"}
            </h2>

            {/* Decorative Line */}
            <div className="flex items-center gap-2 mt-4">
              <div className="w-10 h-[2px] bg-amber-300 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-amber-600" />
              <div className="w-10 h-[2px] bg-amber-300 rounded-full" />
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              {modal.type === "diary"
                ? "Select new teacher"
                : "Select proxy teacher"}
            </label>

            <CustomSelect
              isSubmitting={isSubmitting}
              options={customizedTeachers}
              isButton
              handler={
                modal.type === "diary" ? handleChangeDiary : handleAssignProxy
              }
            />
          </div>
          {/* Student & Teacher Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
            {/* Student */}
            <div className="flex gap-3 p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 flex items-center justify-center">
                  <FaUser className="text-amber-700 text-lg" />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Student
                </p>
                <p className="text-xs lg:text-sm mt-1 font-semibold text-gray-800">
                  {selectedStudent.name}
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-200" />

            {/* Current Teacher */}
            <div className="flex gap-3 p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 flex items-center justify-center">
                  <FaChalkboardTeacher className="text-amber-700 text-lg" />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Current Teacher
                </p>
                <p className="text-xs lg:text-sm mt-1 font-semibold text-gray-800">
                  {selectedStudent.teacher || "No Teacher Assigned"}
                </p>
              </div>
            </div>

            {selectedStudent.proxyTeacher && (
              <>
                <div className="border-t border-neutral-200" />

                <div className="flex gap-3 p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 flex items-center justify-center">
                      <FaUserCheck className="text-green-700 text-lg" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">
                      Current Proxy
                    </p>
                    <p className="text-xs lg:text-sm mt-1 font-semibold text-gray-800">
                      {selectedStudent.proxyTeacher}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Note */}
          <div className="flex items-center gap-2 text-xs justify-center text-gray-500">
            <FaShieldAlt className="text-green-600" />
            <span>
              {modal.type === "diary"
                ? "This will update the teacher's diary."
                : "This will assign a proxy teacher."}
            </span>
          </div>
        </div>
      </Modal>
    );
}

export default DiaryAndProxyForm
