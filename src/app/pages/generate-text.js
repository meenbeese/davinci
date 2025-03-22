import axios from 'axios'




const promptsOptions = {
    method: 'POST',
    url: 'https://api.cohere.ai/v1/generate',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer xT4I0MQlM32yMdguwuXc70fewascez4VisECudWM'//march 22
    },
    data: {
        max_tokens: 350,
        truncate: 'END',
        return_likelihoods: 'NONE',
        prompt: ""
    }
}

// console.log("Hello, World!");

// Function to call the API
export const fetchData = async () => {
    try {
        const response = await axios(promptsOptions);
        console.log(response.data); // Log the response data
        return response.data; // Return the data for further use
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

