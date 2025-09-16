// import React, { useEffect } from 'react';

// const GetData = ({ setCardSetsData }) => {
//     useEffect(() => {
//         fetch('./mockData.json')
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 setCardSetsData(data);
//             })
//             .catch(error => {
//                 console.error("Error fetching data:", error);
//             });
//     }, [setCardSetsData]);

//     return null;
// };

// export default GetData;
