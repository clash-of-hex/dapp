/* eslint-disable */
const { TonClient, signerKeys, signerNone } = require("@eversdk/core");
const { libWeb, libWebSetup } = require("@eversdk/lib-web");
const { Account } = require("@eversdk/appkit");
libWebSetup({
    binaryURL: "./eversdk.wasm",
});

TonClient.useBinaryLibrary(libWeb)

let everClient;
let subscribeAcc;

const createClient = (endpoint) => {
  let client = new TonClient({
      network: {
          endpoints: [endpoint],
          message_retries_count: 3,
          message_processing_timeout: 60000,
      },
  });
  return client
};

const initClient = (endpoint) => {
  everClient = createClient(endpoint)
};

const getAccount = (abi, address = '', keys = null) => {
    try {
        return new Account({abi}, {
            address: address,
            signer: (keys ? signerKeys(keys) : signerNone()),
            client: everClient
        });
    } catch (error) {
        console.error(error);
    }
};

const getAccArr = async (addreses) => {
    try {
        const result = (await everClient.net.query_collection({
            collection: "accounts",
            filter: {
                id: {
                    in: addreses,
                },
            },
            result: "id acc_type balance boc",
        })).result;

        return result;
    } catch (error) {
        console.error(error);
    }
};

const runLocal = async (abi, address, functionName, input = {}, log = true, boc = null)  => {
  try {
    const [account, message] = await Promise.all([
        boc || everClient.net.query_collection({
            collection: "accounts",
            filter: { id: { eq: address } },
            result: "boc",
        })
            .then(({ result }) => result[0].boc)
            .catch(() => {
                return undefined;
            }),
        everClient.abi.encode_message({
            abi: {
                type: 'Contract',
                value: (abi)
            },
            address,
            call_set: {
                function_name: functionName,
                input: input,
            },
            signer: { type: "None" },
        }).then(({ message }) => message),
    ]);
    if (!account) return undefined;
    let response = await everClient.tvm.run_tvm({
        message: message,
        account: account,
        abi: {
            type: 'Contract',
            value: (abi)
        },
    });
    if (log) console.log("output:", response.decoded.output);

    return response.decoded.output;
  } catch (error) {
      console.error(error, functionName, input);
  }
}

export default {
  initClient,
  createClient,
  getAccount,
  getAccArr,
  runLocal,
}
