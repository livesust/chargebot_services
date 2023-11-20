import middy from "@middy/core";
import warmup from "@middy/warmup";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "../shared/middlewares/joi-validator";
import jsonBodySerializer from "../shared/middlewares/json-serializer";
import { CompanyArrayResponseSchema } from "./company.schema";
import { Company } from "@chargebot-services/core/services/company";

const isWarmingUp = (event: any) => event.isWarmingUp === true

const handler = async (event: any) => {
    const companys = await Company.list();
    const response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: companys
    };
    return response;
};

export const main = middy(handler)
    // before
    .use(warmup({ isWarmingUp }))
    // after: inverse order execution
    .use(httpErrorHandler())
    .use(jsonBodySerializer())
    .use(validator({ responseSchema: CompanyArrayResponseSchema }));