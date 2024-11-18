---
title: "Marlowe Tech Specs"
toc: false
permalink: specs.html
seealso: true
folder: faq
---

Marlowe consists of a 1SU (Scalable Unit) NVIDIA DGX H100 SuperPOD.
One H100 Scalable Unit is 31 NVIDIA DGX H100 servers.

Compute power: 11.1 PFlops.

## DGX H100 Specs

Each DGX H100 has:

- 2 x Intel Xeon Platinum 8480C
- 8 x Nvidia H100 80GB
- 2TB Memory
- 400G NICs for fast data access

## Networking

Marlowe consists of four main networks:

- 400Gb Infiniband compute network to connect all compute nodes together
- 400Gb Infiniband storage network to connect all compute nodes to the DDN Exascaler scratch storage
- 100Gb Ethernet network to connect to DDN Intelliflash storage (used for home and project directories)
- 100Gb Ethernet network to connect to the campus network (SUNet) and the outside world

## Storage

- 2.5PB of DDN ExaScaler Lustre storage
- 3PB of DDN Intelliflash storage 