const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

const agencyClass = require('./agency-class.js');

const eCFRFileName = 'agencies.json';

const eCFRDataURL = 'https://www.ecfr.gov/api/admin/v1/agencies.json';
const agencyCountURL = "https://www.ecfr.gov/api/search/v1/count";
const agencyCountByDateURL = "https://www.ecfr.gov/api/search/v1/counts/daily";
const agencyCountByTitleURL = "https://www.ecfr.gov/api/search/v1/counts/titles";

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors()); // Enable CORS for all routes and origins

// GET /status - Returns API status
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /eCFRData - Returns eCRF Agency Data from the API and writes it to a file
app.get('/eCFRData', (req, res) => {
  
  console.log(`eCFRDataURL=:${eCFRDataURL}`);
  
  const promise = geteCFRData(eCFRDataURL);

  const data = promise.then(data => {return new Promise(resolve => {
    setTimeout(() => {
      resolve('Data has been fetched!');

      writeAgenciesToFile(data); // Write the fetched data to a file

      res.json({
        agencyData: data,  
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        })

    }, 2000); // Waits for 2 seconds
  
  })}).then(message => {    
    console.log(message);
  }).catch(error => {
    console.error('Error fetching eCFR data:', error.message);
    res.status(500).json({ error: 'Failed to fetch eCFR data' });
  }); 

  console.log(`called eCFRDataURL=:${eCFRDataURL}...data=:${data}`);
  
});

// GET /eCFRData - Returns eCRF Agency Change Count Data from the file and send it to the client
app.get('/eCFRData-agency-change-counts', (req, res) => {  
	console.log(`Calling readeCFRData`);
  
	const data = readeCFRData();
  
	console.log(`Called readeCFRData`);
  
	//Perform the analysis of the data here and send the results to the client
	const agencies = agencyClass.Agencies.fromJSON(data);

  agencies.forEach(agency => {
    console.log(`agencyName: ${agency.name} agencySlug  ${agency.slug}`);

      const agencyChangeCountData = getAgencyChangeCount(agency.slug);
      agency.agencyChangeCounts = agencyClass.AgencyChangeCounts.fromJSON(agencyChangeCountData);
      
  });

  writeAgenciesToFile(agencies.toJSON()); // Write the updated data back to the file

	res.json({
		agencyData: agencies.toJSON(),  
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	});
 

});

// GET /eCFRData-agency-change-counts-by-date - Returns eCRF Agency Change Count Data By Date from the file and send it to the client
app.get('/eCFRData-agency-change-counts-by-date', (req, res) => {  
	console.log(`Calling readeCFRData`);
  
	const data = readeCFRData();
  
	console.log(`Called readeCFRData`);
  
	//Perform the analysis of the data here and send the results to the client
	const agencies = agencyClass.Agencies.fromJSON(data);

  agencies.forEach(agency => {
    console.log(`agencyName: ${agency.name} agencySlug  ${agency.slug}`);

      const agencyChangeCountByDateData = getAgencyChangeCountByDate(agency.slug);      
      agency.agencyChangeCountsByDate = agencyChangeCountByDateData;
      
  });

  writeAgenciesToFile(agencies.toJSON()); // Write the updated data back to the file

	res.json({
		agencyData: agencies.toJSON(),  
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	});
 

});

// GET /eCFRData-agency-change-counts-by-title - Returns eCRF Agency Change Count Data By Title from the file and send it to the client
app.get('/eCFRData-agency-change-counts-by-title', (req, res) => {  
	console.log(`Calling readeCFRData`);
  
	const data = readeCFRData();
  
	console.log(`Called readeCFRData`);
  
	//Perform the analysis of the data here and send the results to the client
	const agencies = agencyClass.Agencies.fromJSON(data);

  agencies.forEach(agency => {
    console.log(`agencyName: ${agency.name} agencySlug  ${agency.slug}`);

      const agencyChangeCountByTitleData = getAgencyChangeCountByTitle(agency.slug);
      agency.agencyChangeCountsByTitle = agencyChangeCountByTitleData;
      
  });

  writeAgenciesToFile(agencies.toJSON()); // Write the updated data back to the file

	res.json({
		agencyData: agencies.toJSON(),  
		status: 'ok',
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	});
 

});


// POST /echo - Echoes back the request body
app.post('/echo', (req, res) => {
  res.json({
    message: 'Echo response',
    receivedData: req.body
  });
});

// Start the server
app.listen(PORT, () => {
  
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Try: GET http://localhost:${PORT}/status`);
  console.log(`Try: POST http://localhost:${PORT}/echo with JSON body`);  
  console.log(`Try: GET http://localhost:${PORT}/eCFRData`);  
  console.log(`Try: GET http://localhost:${PORT}/eCFRData-agency-change-counts`);  
  console.log(`Try: GET http://localhost:${PORT}/eCFRData-agency-change-counts-by-date`);
  console.log(`Try: GET http://localhost:${PORT}/eCFRData-agency-change-counts-by-title`);
  

});


/**
 * Generic REST API caller using fetch
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {object} data - Request body data (optional)
 * @param {object} headers - Additional headers (optional)
 * @returns {Promise<object>} - Response data
 */
async function callAPI(url, method = 'GET', data = null, headers = {}) {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
    
  console.log(`url=:${url}`);
  
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {	  
	    console.log(`calling url=:${url}`);
	  
		const response = await fetch(url, options);
    
	    console.log(`called url=:${url}...response=:${response.status}`);
	
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
    
		return await response.json();

  } catch (error) {
    console.error('API call failed:', error.message);
    throw error;
  };
  
}

/**
 * Synchronously call a REST API using sync-request
 * @param {string} url - The API endpoint URL
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {object} options - Additional options (body, headers, etc.)
 * @returns {any} - Parsed JSON response
 */
function callAPISync(url, method = 'GET', options = {}) {
  try {
    const request = require('sync-request');
    
    const requestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    // Add body for POST/PUT requests
    if (options.body && (method === 'POST' || method === 'PUT')) {
      requestOptions.json = options.body;
    }
    
    // Make synchronous request - execution blocks here until response received
    const response = request(method, url, requestOptions);
    
    // Check status code
    if (response.statusCode >= 200 && response.statusCode < 300) {
      const data = JSON.parse(response.getBody('utf8'));
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.statusCode}`);
    }
  } catch (error) {
    console.error('Sync API call failed:', error.message);
    throw error;
  }
}



function geteCFRData(eCRFDataURL) {
    return callAPI(eCRFDataURL);
};

function getAgencyChangeCount(agencySlug) { 
    const url = agencyCountURL;
    const queryString = `?agency_slugs%5B%5D=${agencySlug}`;

    console.log(`url=:${url}...queryString=:${queryString}`);

    try {
		  const data = callAPISync(url + queryString);
		  console.log('Data received:', data);
		  return data;
		
	} catch (error) {
		console.error('Error:', error.message);
	}

}

function getAgencyChangeCountByDate(agencySlug) { 
    const url = agencyCountByDateURL;    
    const queryString = `?agency_slugs%5B%5D=${agencySlug}`;

    console.log(`url=:${url}...queryString=:${queryString}`);

    try {
		  const data = callAPISync(url + queryString);
		  console.log('Data received:', data);
		  return data;
		
	} catch (error) {
		console.error('Error:', error.message);
	}
}

function getAgencyChangeCountByTitle(agencySlug) { 
    const url = agencyCountByTitleURL;
    const queryString = `?agency_slugs%5B%5D=${agencySlug}`;

    console.log(`url=:${url}...queryString=:${queryString}`);

    try {
		  const data = callAPISync(url + queryString);
		  console.log('Data received:', data);
		  return data;
		
	} catch (error) {
		console.error('Error:', error.message);
	}
}

function writeAgenciesToFile(agencies) {
  
  const fs = require('fs');
  const path = require('path');

  // Get the current working directory from where the app was launched
  const startupDirectory = process.cwd(); 
  
  // Combine the directory path and file name
  const filePath = path.join(startupDirectory, eCFRFileName);

  deleteFileSync(filePath); // Attempt to delete the file before writing new data

  const content = JSON.stringify(agencies, null, 2);

  fs.writeFile(filePath, JSON.stringify(agencies, null, 2), (err) => {
    if (err) {
      console.error('Error writing agencies to file:', err);
    } else {
      console.log(`Agencies data has been written to ${filePath}`);
    }
  });

};

async function deleteFile(filePath) {
  
    const fs = require('fs');
  
    try {
        await fs.unlink(filePath); // Attempt to delete the file directly
        console.log(`Successfully deleted ${filePath}`);
    } catch (error) {
        // Handle the error if the file does not exist or other issues occur
        if (error.code === 'ENOENT') {
          console.log(`File not found: ${filePath}`);
      } 
      
      else {
        console.error(`Error deleting file: ${error.message}`);
      }  
  }

};

function deleteFileSync(filePath) {
  
    const fs = require('fs');

    try {
        fs.unlinkSync(filePath); // Attempt to delete the file synchronously
        console.log(`Successfully deleted ${filePath} synchronously`);
    } catch (error) {
        // Handle the error (e.g., file not found)
        if (error.code === 'ENOENT') {
          console.log(`File not found synchronously: ${filePath}`);
        } else {
          console.error(`Error deleting file synchronously: ${error.message}`);
        }
    }

};

function readeCFRData() {
  
    const fs = require('fs');
    const path = require('path');

    // Get the current working directory from where the app was launched
    const startupDirectory = process.cwd(); 

    // Combine the directory path and file name
    const filePath = path.join(startupDirectory, eCFRFileName);

    const data = fs.readFileSync(filePath, 'utf-8', (err) => {
      if (err) {
        console.error('Error reading agencies from file:', err)
      } else {
        console.log(`Agencies data has been read from ${filePath}`);
      }
    });

    return JSON.parse(data);
        

};



  
  
  