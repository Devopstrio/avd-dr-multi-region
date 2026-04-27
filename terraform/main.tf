# Devopstrio AVD Multi-Region DR
# Global Infrastructure as Code (Terraform)
# Target: Azure RM

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }
}

provider "azurerm" {
  features {}
}

# 1. Regional Resource Groups
resource "azurerm_resource_group" "primary_rg" {
  name     = "rg-avd-dr-primary-uks"
  location = "uksouth"
}

resource "azurerm_resource_group" "secondary_rg" {
  name     = "rg-avd-dr-secondary-new"
  location = "northeurope"
}

# 2. Global Traffic Manager (Cutover Orchestrator)
resource "azurerm_traffic_manager_profile" "avd_tm" {
  name                   = "tm-avd-global-resilience"
  resource_group_name    = azurerm_resource_group.primary_rg.name
  traffic_routing_method = "Priority"

  dns_config {
    relative_name = "avd-resilience-devopstrio"
    ttl           = 60
  }

  monitor_config {
    protocol                     = "HTTPS"
    port                         = 443
    path                         = "/health"
    interval_in_seconds          = 30
    timeout_in_seconds           = 10
    tolerated_number_of_failures = 3
  }
}

# 3. Geo-Replicated Profile Storage (Azure Files GRS)
resource "azurerm_storage_account" "primary_profiles" {
  name                     = "stavdprimaryuks"
  resource_group_name      = azurerm_resource_group.primary_rg.name
  location                 = azurerm_resource_group.primary_rg.location
  account_tier             = "Premium"
  account_replication_type = "GZRS" # Geo-Zone Redundant Storage

  file_share_properties {
    retention_policy {
      days = 7
    }
  }
}

# 4. Multi-Region Workspace & Host Pool
resource "azurerm_virtual_desktop_workspace" "workspace" {
  name                = "vdws-avd-resilient"
  location            = azurerm_resource_group.primary_rg.location
  resource_group_name = azurerm_resource_group.primary_rg.name
  friendly_name       = "Devopstrio Resilient Global Workspace"
}

resource "azurerm_virtual_desktop_host_pool" "primary_pool" {
  name                = "vdpool-primary-uks"
  location            = azurerm_resource_group.primary_rg.location
  resource_group_name = azurerm_resource_group.primary_rg.name
  type                             = "Pooled"
  load_balancer_type               = "BreadthFirst"
  maximum_sessions_allowed         = 12
  validate_environment             = false
}

resource "azurerm_virtual_desktop_host_pool" "secondary_pool" {
  name                = "vdpool-secondary-new"
  location            = azurerm_resource_group.secondary_rg.location
  resource_group_name = azurerm_resource_group.secondary_rg.name
  type                             = "Pooled"
  load_balancer_type               = "BreadthFirst"
  maximum_sessions_allowed         = 12
}

# 5. Azure Compute Gallery (Image Replication)
resource "azurerm_shared_image_gallery" "gallery" {
  name                = "gal_avd_dr_images"
  resource_group_name = azurerm_resource_group.primary_rg.name
  location            = azurerm_resource_group.primary_rg.location
  description         = "Replicated golden images for multi-region resilience."
}

# Outputs
output "traffic_manager_fqdn" {
  value = azurerm_traffic_manager_profile.avd_tm.fqdn
}

output "primary_hostpool_id" {
  value = azurerm_virtual_desktop_host_pool.primary_pool.id
}
