// Function to dynamically generate HTML fields for each endpoint
function generateEndpointFields() {
    const endpointsDiv = document.getElementById('endpoints');
// Iterate over each endpoint and generate HTML
    for (const [endpointName, fields] of Object.entries(endpointData)) {
        const endpointWrapper = document.createElement('div');
        endpointWrapper.className = 'endpoint-wrapper';
        endpointWrapper.id = `${endpointName}`;

        const title = document.createElement('h3');
        title.textContent = `${endpointName} `;
        endpointWrapper.appendChild(title);

        // Create form fields for each endpoint
        for (const [key, placeholder] of Object.entries(fields)) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.textContent = `${key}:`;

            const input = document.createElement('input');
            input.type = 'text';
            input.setAttribute('data-key', key);
            input.placeholder = placeholder;

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            endpointWrapper.appendChild(formGroup);
        }

        // Append this endpoint section to the main div
        endpointsDiv.appendChild(endpointWrapper);
    }
}

// Function to generate YAML from form inputs
function generateYaml() {
    const connectorProperties = {};

    // Collect connector fields (outside of auth)
    const connectorFields = document.querySelectorAll('#connector-properties [data-key]');
    connectorFields.forEach(field => {
        const key = field.getAttribute('data-key');
        const value = field.value;

        if (value) {
            const keys = key.split('.'); // Split key by dot notation
            let currentLevel = connectorProperties;

            keys.forEach((part, index) => {
                if (index === keys.length - 1) {
                    currentLevel[part] = value; // Assign value at the last level
                } else {
                    if (!currentLevel[part]) {
                        currentLevel[part] = {}; // Create object if it doesn't exist
                    }
                    currentLevel = currentLevel[part]; // Move to the next level
                }
            });
        }
    });

     
    // // Ensure auth object exists under connectorProperties
    // if (!connectorProperties.auth) {
    //     connectorProperties.auth = {}; // Initialize auth object if not present
    // }

    // // Collect auth type from dropdown and store it in connectorProperties.auth.type
    // const authType = document.getElementById('auth.type').value;
    // if (authType) {
    //     connectorProperties.auth.type = authType; // Set the selected auth type (basic, token, header)
    // }

    // // Collect other auth fields (username, password, API key, etc.)
    // const authFields = document.querySelectorAll('#auth-fields [data-key]');
    // authFields.forEach(field => {
    //     const key = field.getAttribute('data-key');
    //     const value = field.value;

    //     if (value) {
    //         connectorProperties.auth[key] = value; // Assign value directly to auth object
    //     }
    // });
// Ensure at least one endpoint is created before generating YAML
const updateendpointSections = document.querySelectorAll('#endpoints .endpoint-wrapper');
if (updateendpointSections.length === 0) {
    // If no endpoints exist, create one before proceeding
    CreateNewEndpoint();
}
//   // Handle Endpoint Properties
//   const endpoints = {};
//   const endpointSections = document.querySelectorAll('#endpoints .endpoint-wrapper');

//   endpointSections.forEach(section => {
//       const endpointNameElement = section.querySelector('.endpoint-button h3');
//       const endpointName = endpointNameElement.textContent.replace(' Endpoint', '').trim(); // Get endpoint name
      
//       const endpointConfig = {};
//       const endpointFields = section.querySelectorAll('[name]'); // Use 'name' attribute for all fields

//       // Debugging: Log the number of fields found for each endpoint
//       console.log(`Endpoint: ${endpointName}, Fields found: ${endpointFields.length}`);

//       endpointFields.forEach(field => {
//           const key = field.getAttribute('name'); // Get the 'name' attribute
//           const value = field.value;

//           if (value) {
//               const keys = key.split('.'); // Handle dot notation for nested keys
//               let currentLevel = endpointConfig;

//               // Traverse nested objects to set values at the correct level
//               keys.forEach((part, index) => {
//                   if (index === keys.length - 1) {
//                       // Special check for baseUrl, treat it as a string and not array of characters
//                       if (key === 'baseUrl') {
//                           currentLevel[part] = value; // Direct assignment of the baseUrl
//                       } else {
//                           currentLevel[part] = value;
//                       }
//                   } else {
//                       if (!currentLevel[part]) {
//                           currentLevel[part] = {}; // Initialize if not present
//                       }
//                       currentLevel = currentLevel[part]; // Move to the next nested level
//                   }
//               });
//           }
//       });

//       // Debugging: Log the endpoint config after processing
//       console.log(`Endpoint: ${endpointName}, Config:`, endpointConfig);

//       // Only add the endpoint if it has any fields populated
//       if (Object.keys(endpointConfig).length > 0) {
//           endpoints[endpointName] = endpointConfig;
//       }
//   });
// Handle Endpoint Properties
const endpoints = {};
const endpointSections = document.querySelectorAll('#endpoints .endpoint-wrapper');

endpointSections.forEach(section => {
    const endpointName = section.id; // Use the 'id' as the endpoint name
    
    const endpointConfig = {};
    const endpointFields = section.querySelectorAll('input, textarea'); // Collect all inputs and textareas within the endpoint wrapper

    // Debugging: Log the number of fields found for each endpoint
    console.log(`Endpoint: ${endpointName}, Fields found: ${endpointFields.length}`);

    endpointFields.forEach(field => {
        const key = field.getAttribute('name'); // Get the 'name' attribute
        const value = field.value;

        if (value) {
            const keys = key.split('.'); // Handle dot notation for nested keys
            let currentLevel = endpointConfig;

            keys.forEach((part, index) => {
                if (index === keys.length - 1) {
                    // Special check for baseUrl, treat it as a string and not array of characters
                    if (part === 'baseUrl') {
                        currentLevel[part] = value; // Direct assignment of baseUrl
                    } else {
                        currentLevel[part] = value; // Regular assignment for other fields
                    }
                } else {
                    if (!currentLevel[part]) {
                        currentLevel[part] = {}; // Initialize if not present
                    }
                    currentLevel = currentLevel[part]; // Move to the next nested level
                }
            });
        }
    });

    // Debugging: Log the endpoint config after processing
    console.log(`Endpoint: ${endpointName}, Config:`, endpointConfig);

    // Only add the endpoint if it has any fields populated
    if (Object.keys(endpointConfig).length > 0) {
        endpoints[endpointName] = endpointConfig;
    }
});

// Debugging: Log all collected endpoints
console.log("All endpoints: ", endpoints);

  
 // Final YAML structure
    const yamlObject = {
        ConnectorProperties: connectorProperties,
        EndPointProperties: endpoints,
    };

    // Convert to YAML and display
    const yamlString = convertToYaml(yamlObject);
    document.getElementById('yaml-output').innerText = yamlString;
     // Create and display fields for a new endpoint
   
} 

function addEndpoint() {
    const endpointsDiv = document.getElementById('endpoints');
    const endpointIndex = endpointsDiv.children.length;
    const formFieldsHtml = createFormFields(endpointConfig);
    endpointsDiv.insertAdjacentHTML('beforeend', endpointHtml);
}

function convertToYaml(obj, indent = '') {
    let yaml = '';
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'object' && !Array.isArray(value)) {
                yaml += `${indent}${key}:\n${convertToYaml(value, indent + '  ')}`; // Recursively handle nested objects
            } else if (Array.isArray(value)) {
                yaml += `${indent}${key}:\n`;
                value.forEach(item => {
                    yaml += `${indent}  - ${item}\n`; // Handle arrays in YAML
                });
            } else {
                yaml += `${indent}${key}: ${value}\n`; // Handle primitive types
            }
        }
    }
    return yaml;
}


function downloadYamlFile() {
    const yamlContent = document.getElementById('yaml-output').innerText;

    const blob = new Blob([yamlContent], { type: 'text/yaml' });

    const link = document.createElement('a');

    link.download = 'config.yaml';

    link.href = URL.createObjectURL(blob);

    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

let uploadedProperties = {}; // Store properties globally
// Initialize an empty object for EndPointProperties
let endPointProperties = {};
function loadYamlFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const yamlContent = e.target.result;
            try {
                // Parse the YAML content into a JavaScript object
                uploadedProperties = jsyaml.load(yamlContent);
                populateFormFields(uploadedProperties);  // Populate the form fields
                
            } catch (error) {
                alert('Error parsing YAML file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}


function showPropertiesDropdown() {
    const dropdown = document.getElementById('properties-dropdown');
    const propertiesList = document.getElementById('properties-list');

    // Show dropdown
    if (dropdown) {
    dropdown.style.display = 'block';
    }
    // Clear existing options
    propertiesList.innerHTML = '<option value="">Select a Property</option>';

    // Add properties to the dropdown
    if (endPointProperties) {
        for (const property in endPointProperties) {
            const option = document.createElement('option');
            option.value = property;
            option.text = property;
            propertiesList.appendChild(option);
        }
        
    }
    propertiesList.onchange = function() {
        const selectedValue = this.value;
        if (selectedValue) {
            handleDropdownSelection(selectedValue); // Call the dropdown handler when an option is selected
        }
    };

}

// // Function to add an endpoint with a remove button
// function populateEndpointFromProperties() {
//     const selectedProperty = document.getElementById('properties-list').value;
//     const endpointsDiv = document.getElementById('endpoints');

//     if (selectedProperty && uploadedProperties.EndPointProperties[selectedProperty]) {
//         const endpointConfig = uploadedProperties.EndPointProperties[selectedProperty];

//         // Create a new endpoint section for the selected endpoint with a remove button
//         const endpointHtml = `
//             <div class="endpoint-wrapper" id="endpoint-${selectedProperty}">
//             <div class="endpoint-button"> 
//                 <h3>Endpoint: ${selectedProperty}</h3>
//                 <button class="remove-btn" onclick="removeEndpoint('endpoint-${selectedProperty}')">Remove Endpoint</button>
//             </div>
//                 <div class="endpoint-attributes">
//                     ${createFormFields(endpointConfig)}
//                 </div>
//             </div>`;

//         const newEndpointDiv = document.createElement('div'); 
//         newEndpointDiv.innerHTML = endpointHtml;
//         endpointsDiv.appendChild(newEndpointDiv);
//     }
// }

// Function to remove an entire endpoint section including its attributes
function removeEndpoint(endpointId) {
    const endpointElement = document.getElementById(endpointId);
    if (endpointElement) {
    endpointElement.remove(); // This will remove the entire endpoint container with its attributes
    removeEndpointFromDropdown(endpointId);
    delete endPointProperties[endpointId]
    }
     
}


function populateFormFields(yamlObject) {
    if (yamlObject.ConnectorProperties) {
        const connectorProps = yamlObject.ConnectorProperties;
        const connectorPropertiesDiv = document.getElementById('connector-properties');
        connectorPropertiesDiv.innerHTML = '';  // Clear existing content

        // Populate Connector Properties, including nested objects like auth and headers
        connectorPropertiesDiv.innerHTML = createConnectorFields(connectorProps, '', 0);
        if (connectorProps.auth && connectorProps.auth.type) {
            // showAuthFields(connectorProps.auth.type);

            // Pre-fill auth fields if available
            if (connectorProps.auth.username) {
                
                document.getElementById('auth.username').value = connectorProps.auth.username;
             }
            if (connectorProps.auth.password) {
                document.getElementById('auth.password').value = connectorProps.auth.password;
            }
            if (connectorProps.auth.apiKey) {
                document.getElementById('auth.apiKey').value = connectorProps.auth.apiKey;
            }
            if (connectorProps.auth.headerKey) {
                document.getElementById('auth.headerKey').value = connectorProps.auth.headerKey;
            }
            if (connectorProps.auth.headerValue) {
                document.getElementById('auth.headerValue').value = connectorProps.auth.headerValue;
            }
        }
}
if (yamlObject.EndPointProperties) {
    const endpointProps = yamlObject.EndPointProperties;
    const endpointsDiv = document.getElementById('endpoints');
    endPointProperties=endpointProps;
    endpointsDiv.innerHTML = '';  // Clear existing content

    // Populate Endpoints Properties, including nested objects
    for (const endpoint in endpointProps) {
        let endpointConfig;
        if(endpoint!="baseUrl"){
        endpointConfig = endpointProps[endpoint];}
        else{endpointConfig={"baseUrl":endpointProps[endpoint]}}
        const endpointHtml = `
            <div class="endpoint-wrapper" id="${endpoint}">
                <div class="endpoint-button"> 
                    <h3>${endpoint} 
                 </h3>
                    <button class="remove-btn" onclick="removeEndpoint('${endpoint}')">Remove Endpoint</button>
                </div>
                <div class="endpoint-attributes">
                    ${createFormFields(endpointConfig)}
                </div>
            </div>`;

        const newEndpointDiv = document.createElement('div'); 
        newEndpointDiv.innerHTML = endpointHtml;
        endpointsDiv.appendChild(newEndpointDiv);
    }
}
}


function createConnectorFields(obj, parentKey = '', depth = 1) {
    let html = '';
    const authTypes = ['basic', 'token', 'header'];
    for (const key in obj) {

        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            if (fullKey === 'auth.type') {
                // Create dropdown for auth types
                html += `<div class="form-group">
                            <label for="${fullKey}">Auth Type:</label>
                            <select id="${fullKey}" data-key="${fullKey}" onchange="showAuthFields(this.value)">
                                <option value="">Select Auth Type</option>
                                ${authTypes.map(type => `<option value="${type}" ${value === type ? 'selected' : ''}>${type}</option>`).join('')}
                            </select>
                         </div>`;}
           else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Recursively handle nested objects
                html += `<div style="margin:0px;" class="nested-field">
                            <label><strong>${key}:</strong></label>
                            ${createConnectorFields(value, fullKey, depth + 1)}
                        </div>`;
            } else if(value != 'X-ApiKeys' && value != "") {
                // Generate input fields for non-object properties
                const inputType = (typeof value === 'boolean') ? 'checkbox' : 'text';
                const inputValue = inputType === 'checkbox' ? (value ? 'checked' : '') : `value="${value}"`;

                html += `<div style="margin:0px;" class="form-group">
                            <label for="${fullKey}">${key}:</label>
                            <input type="${inputType}" id="${fullKey}" data-key="${fullKey}" ${inputValue} />
                        </div>`;
            }
        }
    }

    return html;
}



// Recursive function to generate form fields for nested attributes (including 'auth')
function createFormFields(obj, parentKey = '', depth = 1) {
    let html = '';

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const fullKey = parentKey ? `${parentKey}.${key}` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)&& key!=='auth.Header key') {
                // Recursively handle nested objects
                html += `<div style="margin:0px;" class="nested-field">
                            <label><strong>${key}:</strong></label>
                            ${createFormFields(value, fullKey, depth + 1)}
                        </div>`;
            } else {
                // Generate input fields for non-object properties
                html += `<div style="margin:0px;" class="form-group">
                            <label for="${fullKey}">${key}:</label>
                            <input type="text" id="${fullKey}" name="${fullKey}" value="${value || ''}" />
                        </div>`;
            }
        }
    }

    return html;
}



function showAuthFields(authType) {
    const authFieldsDiv = document.getElementById('auth-fields');
    authFieldsDiv.innerHTML = ''; // Clear previous fields
    const var1 = document.getElementById("auth.type").parentNode;
    // const authDiv = var1.parentNode;
    
    console.log(var1);
    

    if (authType === 'basic') {
        authFieldsDiv.innerHTML = `
            <div class="form-group">
                <label for="auth.username">Username:</label>
                <input type="text" id="auth.username" data-key="auth.username" placeholder="Enter username" />
            </div>
            <div class="form-group">
                <label for="auth.password">Password:</label>
                <input type="password" id="auth.password" data-key="auth.password" placeholder="Enter password" />
            </div>`;}
     else if (authType === 'token') {
        authFieldsDiv.innerHTML = `
            <div class="form-group">
                <label for="auth.apiKey">API Key:</label>
                <input type="text" id="auth.apiKey" data-key="auth.apiKey" placeholder="Enter API key" />
            </div>`;}

     else if (authType === 'header') {
        authFieldsDiv.innerHTML = `
            <div class="form-group">
                <label for="auth.headerKey">Header Key:</label>
                <input type="text" id="auth.headerKey" data-key="auth.headerKey" placeholder="Enter header key" />
            </div>
            <div class="form-group">
                <label for="auth.headerValue">Header Value:</label>
                <input type="text" id="auth.headerValue" data-key="auth.headerValue" placeholder="Enter header value" />
            </div>`;
    }
    var1.parentNode.appendChild(authFieldsDiv);
} 

// function handleDropdownSelection(selectedValue) {
//     if (selectedValue === 'new-endpoint') {
//         CreateNewEndpoint(); // Create new endpoint form
//     } else {
//         const endpointWrapper = document.getElementById(`${selectedValue}`);
        
//         // If the element exists, scroll to the endpoint section
//         if (endpointWrapper) {
//             endpointWrapper.scrollIntoView({ behavior: 'smooth' });
//         } else {
//             // If it doesn't exist, create a new endpoint for the selected value
//             populateEndpointFromProperties(selectedValue);
//         }
//     }
// } 


function populateEndpointFromProperties(selectedProperty) {
    const endpointsDiv = document.getElementById('endpoints');

    if (selectedProperty && uploadedProperties.EndPointProperties[selectedProperty]) {
        const endpointConfig = uploadedProperties.EndPointProperties[selectedProperty];

        // Create a new endpoint section for the selected property
        const endpointHtml = `
            <div class="endpoint-wrapper" id="${selectedProperty}">
                <div class="endpoint-button"> 
                    <h3>${selectedProperty} Endpoint</h3>
                    <button class="remove-btn" onclick="removeEndpoint('${selectedProperty}')">Remove Endpoint</button>
                </div>
                <div class="endpoint-attributes">
                    ${createFormFields(endpointConfig)}
                </div>
            </div>`;

        const newEndpointDiv = document.createElement('div');
        newEndpointDiv.innerHTML = endpointHtml;
        endpointsDiv.appendChild(newEndpointDiv);
    }
}

        // document.getElementById('createNewEndpointButton').addEventListener('click', CreateNewEndpoint);
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('createNewEndpointButton').addEventListener('click', CreateNewEndpoint);
        });
        function CreateNewEndpoint() {
          
            const endpointsDiv = document.getElementById('endpoints');
            // Ask the user for the new endpoint name
            const endpointName = prompt('Please enter the name for the new endpoint:');
    
        if (!endpointName) {
        alert('Endpoint creation cancelled. No name provided.');
        return;
    }
    const mainblock =document.createElement('div');
            // Create a new endpoint wrapper
            const endpointWrapper = document.createElement('div'); 
            mainblock.appendChild(endpointWrapper)
            endpointWrapper.className = 'endpoint-wrapper';
            endpointWrapper.id = `${endpointName}`; // Set ID matching the convention
            
            const title = document.createElement('h3');
            title.textContent = `${endpointName}`; // Update title to match
            const element=document.createElement('div');
            element.className='endpoint-button';
            element.appendChild(title);
            // Add a remove button
            const removeButton = document.createElement('button');
            removeButton.className='remove-btn';
            removeButton.textContent = 'Remove Endpoint';
            removeButton.onclick = function(){
            removeEndpoint(endpointName);
            };
            element.appendChild(removeButton);
            endpointWrapper.appendChild(element);
            const attributes=document.createElement('div');
            attributes.className='endpoint-attributes'; 
            // Define the fields you want to include
            // Assuming you're generating the form dynamically

            const fields = [
                { label: 'Path:', name: 'path', type: 'text', placeholder: 'Enter the API path' },
                { label: 'Headers (key:value):', name: 'headers', type: 'textarea', placeholder: 'Enter headers' },
                { label: 'Method:', name: 'method', type: 'text', placeholder: 'Enter HTTP method' },
                { label: 'Content Type:', name: 'contentType', type: 'text', placeholder: 'Enter content type' },
                { label: 'Max Retry:', name: 'maxRetry', type: 'number', placeholder: 'Enter max retry attempts' },
                { label: 'Retry Delay (ms):', name: 'retryDelayInMs', type: 'number', placeholder: 'Enter retry delay in milliseconds' },
                { label: 'Retry Status Codes:', name: 'retryStatusCodes', type: 'text', placeholder: 'Enter retry status codes (comma-separated)' },
                { label: 'Retry with Delay Status Codes:', name: 'retryWithDelayStatusCodes', type: 'text', placeholder: 'Enter retry status codes with delay (comma-separated)' },
                { label: 'Request Transformer Type:', name: 'requestTransformerType', type: 'text', placeholder: 'Enter request transformer type' },
                { label: 'Request Transformation Config:', name: 'requestTransformationConfig', type: 'textarea', placeholder: 'Enter request transformation configuration' }
            ];
            // Create form fields for each endpoint
            fields.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group' ;
                

                const label = document.createElement('label');
                label.textContent = field.label;

                 // Automatically add tooltip to the "Headers" field
        if (field.name === 'headers') {
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';

            const infoIcon = document.createElement('i');
            infoIcon.className = 'info-icon';
            infoIcon.textContent = 'i';

            const tooltipText = document.createElement('span');
            tooltipText.className = 'tooltiptext';
            tooltipText.textContent =   '  For multiple headers, add in new line';

            tooltip.appendChild(infoIcon);
            tooltip.appendChild(tooltipText);
            label.appendChild(tooltip);
        }

                let input;
                if (field.type === 'textarea') {
                    input = document.createElement('textarea');
                } else {
                    input = document.createElement('input');
                    input.type = field.type;
                }

                input.name = field.name;
                input.placeholder = field.placeholder;

                formGroup.appendChild(label);
                formGroup.appendChild(input);
                attributes.appendChild(formGroup);
                
            });
            endpointWrapper.appendChild(attributes);
           
            
            // Append the new endpoint section to the main div
            endpointsDiv.appendChild(mainblock);
            // addEndpointToDropdown(endpointName);
            endPointProperties[endpointName] = {};
// Optionally, ensure the dropdown is visible after adding the new endpoint
      showPropertiesDropdown();
      
      
        }

    // function CreateNewEndpoint() {
    //     const endpointsDiv = document.getElementById('endpoints');
        
    //     // Ask the user for the new endpoint name
    //     let endpointName = prompt('Please enter the name for the new endpoint:');
    
    //     // Check if the user provided a valid name
    //     if (!endpointName) {
    //         alert('Endpoint creation cancelled. No name provided.');
    //         return;
    //     }
    
    //     // Ensure the new endpoint name is unique by checking the dropdown or existing sections
    //     let uniqueName = endpointName;
    //     let counter = 1;
    //     while (document.getElementById(uniqueName)) {
    //         uniqueName = endpointName + '_' + counter; // Append a number if the name already exists
    //         counter++;
    //     }
    
    //     // Create a new endpoint wrapper
    //     const endpointWrapper = document.createElement('div');
    //     endpointWrapper.className = 'endpoint-wrapper';
    //     endpointWrapper.id = uniqueName; // Use the unique name as the ID
    
    //     const title = document.createElement('h4');
    //     title.textContent = uniqueName; // Display the unique name
    //     endpointWrapper.appendChild(title);
    
    //     // Define the fields you want to include, ensuring unique `name` attributes for each field
    //     const fields = [
    //         { label: 'Path', name: `${uniqueName}_path`, type: 'text' },
    //         { label: 'Headers (key:value)', name: `${uniqueName}_headers`, type: 'textarea' },
    //         { label: 'Method', name: `${uniqueName}_method`, type: 'text' },
    //         { label: 'Content Type', name: `${uniqueName}_contentType`, type: 'text' },
    //         { label: 'Max Retry', name: `${uniqueName}_maxRetry`, type: 'number' },
    //         { label: 'Retry Delay (ms)', name: `${uniqueName}_retryDelayInMs`, type: 'number' },
    //         { label: 'Retry Status Codes (comma-separated)', name: `${uniqueName}_retryStatusCodes`, type: 'text' },
    //         { label: 'Retry with Delay Status Codes (comma-separated)', name: `${uniqueName}_retryWithDelayStatusCodes`, type: 'text' },
    //         { label: 'Request Transformer Type', name: `${uniqueName}_requestTransformerType`, type: 'text' },
    //         { label: 'Request Transformation Config', name: `${uniqueName}_requestTransformationConfig`, type: 'textarea' }
    //     ];
    
    //     // Add a remove button
    //     const removeButton = document.createElement('button');
    //     removeButton.textContent = 'Remove Endpoint';
    //     removeButton.onclick = function() {
    //         endpointsDiv.removeChild(endpointWrapper);
    //         removeEndpointFromDropdown(uniqueName); // Remove from dropdown when deleted
    //     };
    //     endpointWrapper.appendChild(removeButton);
    
    //     // Create form fields for each endpoint, ensuring unique `name` attributes
    //     fields.forEach(field => {
    //         const formGroup = document.createElement('div');
    //         formGroup.className = 'form-group';
    
    //         const label = document.createElement('label');
    //         label.textContent = field.label;
    
    //         let input;
    //         if (field.type === 'textarea') {
    //             input = document.createElement('textarea');
    //         } else {
    //             input = document.createElement('input');
    //             input.type = field.type;
    //         }
    
    //         // Set the unique `name` attribute to each input to avoid conflicts
    //         input.name = field.name;
    
    //         formGroup.appendChild(label);
    //         formGroup.appendChild(input);
    //         endpointWrapper.appendChild(formGroup);
    //     });
    
    //     // Append the new endpoint section to the main div
    //     endpointsDiv.appendChild(endpointWrapper);
    
    //     // Add the new endpoint to the dropdown
    //     addEndpointToDropdown(uniqueName); // Use unique name for dropdown
    
    //     // Optionally, ensure the dropdown is visible after adding the new endpoint
    //     showPropertiesDropdown();
        
    //     // Update the dropdown to include the new endpoint
    //     const propertiesList = document.getElementById('properties-list');
    //     const option = document.createElement('option');
    //     option.value = uniqueName; // Set the value to the unique endpoint name
    //     option.text = uniqueName; // Display the unique endpoint name
    //     propertiesList.appendChild(option);
    // }
    
        // Function to dynamically generate HTML fields for each endpoint
function generateEndpointFields() {
    const endpointsDiv = document.getElementById('endpoints');

    // Iterate over each endpoint and generate HTML
    for (const [endpointName, fields] of Object.entries(endpointData)) {
        const endpointWrapper = document.createElement('div');
        endpointWrapper.className = 'endpoint-wrapper';
        endpointWrapper.id = `${endpointName}`;

        const title = document.createElement('h3');
        title.textContent = `${endpointName} `;
        endpointWrapper.appendChild(title);

        // Create form fields for each endpoint
        for (const [key, placeholder] of Object.entries(fields)) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.textContent = `${key}:`;

            const input = document.createElement('input');
            input.type = 'text';
            input.setAttribute('data-key', key);
            input.placeholder = placeholder;

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            endpointWrapper.appendChild(formGroup);
        }

        // Append this endpoint section to the main div
        endpointsDiv.appendChild(endpointWrapper);

        
    }
}

// // Function to dynamically add an endpoint option to the dropdown
// function addEndpointToDropdown(endpointName) {
// const propertiesList = document.getElementById('properties-list');

//  // Ensure the dropdown exists
//  if (!propertiesList) {
//     console.error('Dropdown element not found');
//     return;
// }
//   // Check if the endpoint already exists in the dropdown
//   for (let i = 0; i < propertiesList.options.length; i++) {
//     if (propertiesList.options[i].value === endpointName) {
//         return; // Endpoint already exists, so do not add it again
//     }
// }
//     const option = document.createElement('option');
//     option.value = endpointName;
//     option.text = endpointName;
//     propertiesList.appendChild(option);
// } 
// function removeEndpointFromDropdown(endpointName) {
//     const propertiesList = document.getElementById('properties-list');
//     for (let i = 0; i < propertiesList.options.length; i++) {
//         if (propertiesList.options[i].value === endpointName) {
//             propertiesList.remove(i); // Remove the option from the dropdown
//             break;
//         }
//     }
// }

function addEndpointToDropdown(endpointName) {
    // Find the dropdown element
    const propertiesList = document.getElementById('properties-list');

    // Create a new option for the dropdown
    const option = document.createElement('option');
    option.value = endpointName; // Set the value to the unique endpoint name
    option.text = endpointName; // Display the unique endpoint name

    // Append the new option to the dropdown
    propertiesList.appendChild(option);
     // Optional: Select the newly added endpoint
     propertiesList.value = endpointName;
}


// Function to remove an endpoint option from the dropdown
function removeEndpointFromDropdown(endpointName) {
    const propertiesList = document.getElementById('properties-list');
    for (let i = 0; i < propertiesList.options.length; i++) {
        if (propertiesList.options[i].value === endpointName) {
            propertiesList.remove(i); // Remove the option from the dropdown
            break;
        }
    }
}

// Handle dropdown selection and navigate to the endpoint
function handleDropdownSelection(selectedValue) {

        const endpointWrapper = document.getElementById(`${selectedValue}`);
        
        // If the element exists, scroll to the endpoint section
        if (endpointWrapper) {
            endpointWrapper.scrollIntoView({ behavior: 'smooth' });

        }
    }
    function createNewFile() {
        // Redirect to the second page (replace 'second-page.html' with the actual file name)
        window.location.href = 'createNew.html';
    }
 