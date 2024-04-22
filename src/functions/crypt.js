import crypto from 'crypto-browserify'
import { Buffer } from 'buffer'

const okay = {
    "production": "-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxz2oGQrUPedlF5MPIlwtaAP+6xE0BNW7q49vNwWPBRhmW4iFOgebzlvUhZpmAefwtmLOKhEdxXcETkr6WaPVSsp0NSQujudLb8J2nKVyKHu6TaaMxLCytPLU092KSw8XcEbegenm+TNU9l4+8A+P/S/Ioc+CY/fxTO4w4UzjEhTNZZ0zAiqpikpWhpu7H8tAG+VQPkqD5HtvI2xPfQ+NNKNFLJr4vlXezIO76BJo4zgw/hT0enX1f1PIs3/I/p14nJAD7uyyimPJHLFfpE4SmEg9YrW2ibbk0krm+I2wQM4WK2B9UMo0ygLBnr51CianhJVYBjd1qTkiavP3f9IrOqTpN1LbjecMO3C4koExE+yKsMykUh/I+NR5pcNSdb7bXhSdpYQIa3pQQlr88TlfP896NWC9EqM/hX3wWSLXf1EKUSCK7jIinJ2dV3HaPxJMyf34yATiNgPzAiDc/kXs9AAuhMq6CsQCggw4aEsrqqiLatITnDswF7wqW2tQxgffhSfoexY5Sx5ub2UfkcjUQtk5yNtDKDPRLZGsX4DYXnfu8wamH4vVPFuhgDlcWzWLbyCs9fuaqzL9OYfTOp0KMfnBtSHvxdyzpuO6bfXSBcs5g070NgyS6CrjPQSsx9cNQWU7KwbP7pe7jSUJBwLaJp5gWgnB585X5ST/DpESjUMCAwEAAQ==-----END PUBLIC KEY-----",
    "beta": "-----BEGIN PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxRvkLKVU4srRCqGlbFiDOXEv3bF1uZvL5Hf5cdX/rIt+dcjj3+ZJbeRfsXyV7DHU+bRPQghb1LUnBesQD4xZApSt2tvLlrAfw+fKQjoRcmgMRHMte2LLEgPIIyjZoqKTWjaMJleYGETgDFMhGLnXMASOKiOtUPcU2agqRfSnzVM0ivNHCGP3/gwMOVpBoVlL0eQYBMHlrRCfblYOCAOaUYOHIBOV1InY20XcGU95K3WiBgRYAlx0JgqcyWvAB6sGrvpPbgqe+yd9Lk5BOEhk0dJG/av/8tRccSDD0IoQMsduw933R0kxTT6c+TAB8ylqa75HVDhUbTuDBMkiv6F2j72Z0ZMI+infuLpCkcd1sRJq/BC21PMRD+Y3UsDqWzLiOTSMYmmJWJt4WkUC8W988+tNHiQ8s4godp+S8a10TPWnkW7HL4yrnUPnBY7g+SsdzVKjqgEprahSyYCWH5HiIxljds1qg6ES6a53TW0WF8dCVG5Gl6WUldZ4GxYW0q65/IrMO1/cIgXDWSVcLZsXgaftnXuqKHdX0TUmReM+x8v4xnUhlOmG9tun2ZKpd/RrLdvb7isapsS4p5mKb+1SLqauu3Ozv2A9UoGeaa4jOANcZwUw0UtSYfk2DrpLwUEbvnMKX6J7w0EwkdljsqpXGCC/IN93mT2Orayp/W5EFSkCAwEAAQ==-----END PUBLIC KEY-----"
}

const crypt = (message) => {
    var encrypt = Buffer.from(message)
    return crypto.publicEncrypt(okay[process.env.REACT_APP_APP_ENV], encrypt).toString('base64')
}

export default crypt