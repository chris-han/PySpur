import axios from 'axios';
import testInput from '../constants/test_input.js'; // Import the test input directly
import JSPydanticModel from './JSPydanticModel'; // Import the JSPydanticModel class
import {
  WorkflowCreateRequest,
  WorkflowDefinition,
  WorkflowResponse,
} from '@/types/api_types/workflowSchemas';
import {
  DatasetResponse,
  DatasetListResponse
} from '@/types/api_types/datasetSchemas';
import {
  EvalRunRequest,
  EvalRunResponse,
} from '@/types/api_types/evalSchemas';
import {
  NodeTypeSchema,
  MinimumNodeConfigSchema
} from '@/types/api_types/nodeTypeSchemas';
import {
  OutputFileResponse,
  OutputFileCreate,
  OutputFileUpdate
} from '@/types/api_types/outputFileSchemas';
import {
  RunResponse,
} from '@/types/api_types/runSchemas';

// const API_BASE_URL = typeof window !== 'undefined'
//   ? `http://${window.location.host}/api`
//   : 'http://localhost:6080/api';

const API_BASE_URL = 'http://localhost:6080/api';

export interface ApiKey {
  name: string;
  value: string;
}

export const getNodeTypes = async (): Promise<{
  schema: Record<string, NodeTypeSchema>;
  metadata: Record<string, any>;
}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/node/supported_types/`);
    console.log('Raw Node Types Response:', response.data);
    const model = new JSPydanticModel(response.data);

    // Get both the processed schema and metadata
    const schema = model.createObjectFromSchema();
    const metadata = model.getAllMetadata();

    console.log('Processed Schema:', schema);
    console.log('Schema Metadata:', metadata);

    // Return both schema and metadata
    return {
      schema,
      metadata,
    };
  } catch (error) {
    console.error('Error getting node types:', error);
    throw error;
  }
};

export const runWorkflow = async (workflowData: WorkflowDefinition): Promise<any> => {
  try {
    // Save the workflow data to a file
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflowData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('New Data:', testInput);

    const response = await axios.post(`${API_BASE_URL}/run_workflow/`, workflowData);
    return response.data;
  } catch (error) {
    console.error('Error running workflow:', error);
    throw error;
  }
};

export const getRunStatus = async (runID: string): Promise<RunResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/run/${runID}/status/`);
    return response.data;
  } catch (error) {
    console.error('Error getting run status:', error);
    throw error;
  }
};

export const getRun = async (runID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/run/${runID}/`);
    console.log('Run Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting run:', error);
    throw error;
  }
};



export const getWorkflows = async (): Promise<WorkflowResponse[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wf/`);
    return response.data;
  } catch (error) {
    console.error('Error getting workflows:', error);
    throw error;
  }
};

export const createWorkflow = async (workflowData: WorkflowCreateRequest): Promise<WorkflowResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wf/`, workflowData);
    return response.data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
};

export const updateWorkflow = async (workflowId: string, workflowData: WorkflowCreateRequest): Promise<WorkflowResponse> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/wf/${workflowId}/`, workflowData);
    return response.data;
  } catch (error) {
    console.error('Error updating workflow:', error);
    throw error;
  }
};

export const resetWorkflow = async (workflowId: string): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/wf/${workflowId}/reset/`);
    return response.data;
  } catch (error) {
    console.error('Error resetting workflow:', error);
    throw error;
  }
};

export const startRun = async (
  workflowID: string,
  initialInputs: Record<string, any> = {},
  parentRunId: string | null = null,
  runType: string = 'interactive'
): Promise<any> => {
  console.log('workflowID', workflowID, 'runType', runType, 'initialInputs', initialInputs, 'parentRunId', parentRunId);
  try {
    const requestBody = {
      initial_inputs: initialInputs,
      parent_run_id: parentRunId,
    };
    const response = await axios.post(`${API_BASE_URL}/wf/${workflowID}/start_run/?run_type=${runType}`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error starting run:', error);
    throw error;
  }
};

export const startBatchRun = async (
  workflowID: string,
  datasetID: string,
  miniBatchSize: number = 10
): Promise<any> => {
  try {
    const requestBody = {
      dataset_id: datasetID,
      mini_batch_size: miniBatchSize,
    };
    const response = await axios.post(`${API_BASE_URL}/wf/${workflowID}/start_batch_run/`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error starting batch run:', error);
    throw error;
  }
};

export const getWorkflow = async (workflowID: string): Promise<WorkflowResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wf/${workflowID}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting workflow:', error);
    throw error;
  }
};


export const getWorkflowRuns = async (workflowID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wf/${workflowID}/runs/`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching workflow runs:', error);
    throw error;
  }
}

export const downloadOutputFile = async (outputFileID: string): Promise<void> => {
  try {
    const fileInfoResponse = await axios.get<OutputFileResponse>(`${API_BASE_URL}/of/${outputFileID}/`);
    const fileName = fileInfoResponse.data.file_name;

    const response = await axios.get(`${API_BASE_URL}/of/${outputFileID}/download/`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading output file:', error);
    throw error;
  }
};

export const getAllRuns = async (
  lastK: number = 10,
  parentOnly: boolean = true,
  runType: string = "batch"
): Promise<any> => {
  try {
    const params = {
      last_k: lastK,
      parent_only: parentOnly,
      run_type: runType,
    };
    // console.log(`Making request to: ${API_BASE_URL}/run/?${new URLSearchParams( params )}`);
    console.debug(`Making request to: ${API_BASE_URL}/run/?${new URLSearchParams( params )}`);    
    const response = await axios.get(`${API_BASE_URL}/run/`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching runs:', error);
    throw error;
  }
};

export const listApiKeys = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/env-mgmt/`);
    return response.data;
  } catch (error) {
    console.error('Error listing API keys:', error);
    throw error;
  }
};

export const getApiKey = async (name: string): Promise<ApiKey> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/env-mgmt/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting API key for ${name}:`, error);
    throw error;
  }
};

export const setApiKey = async (name: string, value: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/env-mgmt/`, { name, value });
    return response.data;
  } catch (error) {
    console.error(`Error setting API key for ${name}:`, error);
    throw error;
  }
};

export const deleteApiKey = async (name: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/env-mgmt/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting API key for ${name}:`, error);
    throw error;
  }
};

export const uploadDataset = async (
  name: string,
  description: string,
  file: File
): Promise<DatasetResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}/ds/?name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading dataset:', error);
    throw error;
  }
};

export const listDatasets = async (): Promise<DatasetListResponse> => {
  try {
    const response = await axios.get<DatasetListResponse>(`${API_BASE_URL}/ds/`);
    return response.data;
  } catch (error) {
    console.error('Error listing datasets:', error);
    throw error;
  }
};

export const getDataset = async (datasetId: string): Promise<DatasetResponse> => {
  try {
    const response = await axios.get<DatasetResponse>(`${API_BASE_URL}/ds/${datasetId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error getting dataset with ID ${datasetId}:`, error);
    throw error;
  }
};

export const deleteDataset = async (datasetId: string): Promise<any> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/ds/${datasetId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting dataset with ID ${datasetId}:`, error);
    throw error;
  }
};

export const listDatasetRuns = async (datasetId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ds/${datasetId}/list_runs/`);
    return response.data;
  } catch (error) {
    console.error(`Error listing runs for dataset with ID ${datasetId}:`, error);
    throw error;
  }
};

export const deleteWorkflow = async (workflowId: string): Promise<number> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/wf/${workflowId}/`);
    return response.status; // Should return 204 No Content
  } catch (error) {
    console.error('Error deleting workflow:', error);
    throw error;
  }
};

export const getTemplates = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/templates/`);
    console.log('Templates:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting templates:', error);
    throw error;
  }
};

export const instantiateTemplate = async (template: any): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/templates/instantiate/`, template);
    return response.data;
  } catch (error) {
    console.error('Error instantiating template:', error);
    throw error;
  }
};

export const duplicateWorkflow = async (workflowId: string): Promise<WorkflowResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wf/${workflowId}/duplicate/`);
    return response.data;
  } catch (error) {
    console.error('Error duplicating workflow:', error);
    throw error;
  }
};

export const runPartialWorkflow = async (
  workflowId: string,
  nodeId: string,
  initialInputs: Record<string, any>,
  partialOutputs: Record<string, any>,
  rerunPredecessors: boolean
): Promise<any> => {
  try {
    const requestBody = {
      node_id: nodeId,
      initial_inputs: initialInputs,
      partial_outputs: partialOutputs,
      rerun_predecessors: rerunPredecessors,
    };
    const response = await axios.post(`${API_BASE_URL}/wf/${workflowId}/run_partial/`, requestBody);
    return response.data;
  } catch (error) {
    console.error('Error running partial workflow:', error);
    throw error;
  }
};

export const getEvals = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/evals/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching evals:', error);
    throw error;
  }
};

export const startEvalRun = async (
  workflowId: string,
  evalName: string,
  outputVariable: string,
  numSamples: number = 10
): Promise<EvalRunResponse> => {
  try {
    const request: EvalRunRequest = {
      workflow_id: workflowId,
      eval_name: evalName,
      output_variable: outputVariable,
      num_samples: numSamples,
    };
    const response = await axios.post<EvalRunResponse>(`${API_BASE_URL}/evals/launch/`, request);
    return response.data;
  } catch (error) {
    console.error('Error starting eval run:', error);
    throw error;
  }
};

export const getEvalRunStatus = async (evalRunId: string): Promise<EvalRunResponse> => {
  try {
    const response = await axios.get<EvalRunResponse>(`${API_BASE_URL}/evals/runs/${evalRunId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching eval run status:', error);
    throw error;
  }
};

export const listEvalRuns = async (): Promise<EvalRunResponse[]> => {
  try {
    const response = await axios.get<EvalRunResponse[]>(`${API_BASE_URL}/evals/runs/`);
    return response.data;
  } catch (error) {
    console.error('Error listing eval runs:', error);
    throw error;
  }
};

export const getWorkflowOutputVariables = async (workflowId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wf/${workflowId}/output_variables/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching output variables for workflow ${workflowId}:`, error);
    throw error;
  }
};

// Continue adding types for other functions similarly...
