import { AwsGuard } from "@pulumi/awsguard";

new AwsGuard("lotctl-awsguard", { 
  all: "advisory" 
});
