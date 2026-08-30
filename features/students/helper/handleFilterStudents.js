export function handleFilterStudents(value,setFilteredStudents,students) {
  if (value.length < 3) return setFilteredStudents(students);
  setFilteredStudents(students);
  setFilteredStudents((el) => {
    const isNumber = Number(value);
    if (isNumber) {
      return el.filter((el) => {
        return el.name.includes(value);
      });
    } else {
      return el.filter((el) => {
        const nameArr = el.name.split(" ");
        const firstName = nameArr[1];
        const lastName = nameArr[nameArr.length - 1];
        const queryArr = value.toLowerCase().split(" ");
        if (queryArr.length > 1) {
          return (
            (firstName.includes(queryArr[0]) &&
              lastName.includes(queryArr[1])) ||
            firstName.includes(queryArr[1] && lastName.includes(queryArr[0]))
          );
        }
        return (
          firstName.includes(value.toLowerCase()) ||
          lastName.includes(value.toLowerCase())
        );
      });
    }
  });
}
