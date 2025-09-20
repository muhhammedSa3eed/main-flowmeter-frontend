"use client";

import CampaignForm from "./campaign-form";
import { CampaignProvider } from "./multi-step-campaign-config";

const MultiStepCampaign = ({RfpId,token}:{RfpId:number;token:string}) => {
	
	return (
		<CampaignProvider>
			<CampaignForm  RfpId={RfpId} token={token}/>
		</CampaignProvider>
	);
};

export default MultiStepCampaign;
