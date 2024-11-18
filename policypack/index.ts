import * as aws from "@pulumi/aws";
import { PolicyPack, validateResourceOfType, ReportViolation } from "@pulumi/policy";
import { policyManager } from "@pulumi/compliance-policy-manager";

new PolicyPack("lotctl-aws", {
	policies:[
		...policyManager.selectPolicies({
			vendors: ["aws"],
			services: ["s3", "acm", "route53","cloudfront"],
			severities: ["medium", "high", "critical"],
			topics: ["encryption"],
			frameworks: ["pcidss"],
		}, "advisory" ),
		{
			name: "required-owner-tag",
			description: "A 'owner' tag is required.",
			enforcementLevel: "mandatory",
			validateResource: [
				validateResourceOfType(aws.s3.Bucket, (bucket, args, reportViolation) => {
					requireOwnerTag(bucket.tags, reportViolation);
				}),
			],
		},
	],
});

policyManager.displaySelectionStats({
	displayGeneralStats: true,
	displayModuleInformation: true,
	displaySelectedPolicyNames: true,
});

function requireOwnerTag(tags: any, reportViolation: ReportViolation) {
	if ((tags || {})["owner"] === undefined) {
		reportViolation("A 'owner' tag is required.");
	}
}
