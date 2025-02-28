"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import { Contract } from "starknet";
import { Box, Button } from "@chakra-ui/react";
import { useDojo } from "../dojo/DojoContext";

export function TournamentTransactions() {
    const { account: {account}} = useDojo()
//   const { account } = useAccount();
  const { provider } = useProvider();
  const [status, setStatus] = useState("");
  const [hash, setHash] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [totalTournaments, setTotalTournaments] = useState(0);
  
  // Contract address from your manifest
  const contractAddress = "0x5de213b0a6c484b6f3da4b8bf0f9adfb88a4737b7b9916bbeb03e3eff47fa7";
  
  // This is your ABI - for brevity, I'm just including a simplified version
  // In a real app, you would import the full ABI from a file
  const abi = [
    {
      "type": "impl",
      "name": "tournament_mock__ContractImpl",
      "interface_name": "dojo::contract::interface::IContract"
    },
    {
      "type": "interface",
      "name": "dojo::contract::interface::IContract",
      "items": []
    },
    {
      "type": "impl",
      "name": "tournament_mock__DeployedContractImpl",
      "interface_name": "dojo::meta::interface::IDeployedResource"
    },
    {
      "type": "struct",
      "name": "core::byte_array::ByteArray",
      "members": [
        {
          "name": "data",
          "type": "core::array::Array::<core::bytes_31::bytes31>"
        },
        {
          "name": "pending_word",
          "type": "core::felt252"
        },
        {
          "name": "pending_word_len",
          "type": "core::integer::u32"
        }
      ]
    },
    {
      "type": "interface",
      "name": "dojo::meta::interface::IDeployedResource",
      "items": [
        {
          "type": "function",
          "name": "dojo_name",
          "inputs": [],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "impl",
      "name": "TournamentInitializerImpl",
      "interface_name": "tournaments::components::tests::mocks::tournament_mock::ITournamentMockInit"
    },
    {
      "type": "enum",
      "name": "core::bool",
      "variants": [
        {
          "name": "False",
          "type": "()"
        },
        {
          "name": "True",
          "type": "()"
        }
      ]
    },
    {
      "type": "interface",
      "name": "tournaments::components::tests::mocks::tournament_mock::ITournamentMockInit",
      "items": [
        {
          "type": "function",
          "name": "initializer",
          "inputs": [
            {
              "name": "safe_mode",
              "type": "core::bool"
            },
            {
              "name": "test_mode",
              "type": "core::bool"
            },
            {
              "name": "test_erc20",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "test_erc721",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "type": "function",
      "name": "dojo_init",
      "inputs": [],
      "outputs": [],
      "state_mutability": "view"
    },
    {
      "type": "impl",
      "name": "WorldProviderImpl",
      "interface_name": "dojo::contract::components::world_provider::IWorldProvider"
    },
    {
      "type": "struct",
      "name": "dojo::world::iworld::IWorldDispatcher",
      "members": [
        {
          "name": "contract_address",
          "type": "core::starknet::contract_address::ContractAddress"
        }
      ]
    },
    {
      "type": "interface",
      "name": "dojo::contract::components::world_provider::IWorldProvider",
      "items": [
        {
          "type": "function",
          "name": "world_dispatcher",
          "inputs": [],
          "outputs": [
            {
              "type": "dojo::world::iworld::IWorldDispatcher"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "impl",
      "name": "UpgradeableImpl",
      "interface_name": "dojo::contract::components::upgradeable::IUpgradeable"
    },
    {
      "type": "interface",
      "name": "dojo::contract::components::upgradeable::IUpgradeable",
      "items": [
        {
          "type": "function",
          "name": "upgrade",
          "inputs": [
            {
              "name": "new_class_hash",
              "type": "core::starknet::class_hash::ClassHash"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        }
      ]
    },
    {
      "type": "impl",
      "name": "TournamentImpl",
      "interface_name": "tournaments::components::tournament::ITournament"
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::Metadata",
      "members": [
        {
          "name": "name",
          "type": "core::felt252"
        },
        {
          "name": "description",
          "type": "core::byte_array::ByteArray"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::schedule::Period",
      "members": [
        {
          "name": "start",
          "type": "core::integer::u64"
        },
        {
          "name": "end",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "type": "enum",
      "name": "core::option::Option::<tournaments::components::models::schedule::Period>",
      "variants": [
        {
          "name": "Some",
          "type": "tournaments::components::models::schedule::Period"
        },
        {
          "name": "None",
          "type": "()"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::schedule::Schedule",
      "members": [
        {
          "name": "registration",
          "type": "core::option::Option::<tournaments::components::models::schedule::Period>"
        },
        {
          "name": "game",
          "type": "tournaments::components::models::schedule::Period"
        },
        {
          "name": "submission_duration",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::GameConfig",
      "members": [
        {
          "name": "address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "settings_id",
          "type": "core::integer::u32"
        },
        {
          "name": "prize_spots",
          "type": "core::integer::u8"
        }
      ]
    },
    {
      "type": "struct",
      "name": "core::array::Span::<core::integer::u8>",
      "members": [
        {
          "name": "snapshot",
          "type": "@core::array::Array::<core::integer::u8>"
        }
      ]
    },
    {
      "type": "enum",
      "name": "core::option::Option::<core::integer::u8>",
      "variants": [
        {
          "name": "Some",
          "type": "core::integer::u8"
        },
        {
          "name": "None",
          "type": "()"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::EntryFee",
      "members": [
        {
          "name": "token_address",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "amount",
          "type": "core::integer::u128"
        },
        {
          "name": "distribution",
          "type": "core::array::Span::<core::integer::u8>"
        },
        {
          "name": "tournament_creator_share",
          "type": "core::option::Option::<core::integer::u8>"
        },
        {
          "name": "game_creator_share",
          "type": "core::option::Option::<core::integer::u8>"
        }
      ]
    },
    {
      "type": "enum",
      "name": "core::option::Option::<tournaments::components::models::tournament::EntryFee>",
      "variants": [
        {
          "name": "Some",
          "type": "tournaments::components::models::tournament::EntryFee"
        },
        {
          "name": "None",
          "type": "()"
        }
      ]
    },
    {
      "type": "struct",
      "name": "core::array::Span::<core::integer::u64>",
      "members": [
        {
          "name": "snapshot",
          "type": "@core::array::Array::<core::integer::u64>"
        }
      ]
    },
    {
      "type": "enum",
      "name": "tournaments::components::models::tournament::TournamentType",
      "variants": [
        {
          "name": "winners",
          "type": "core::array::Span::<core::integer::u64>"
        },
        {
          "name": "participants",
          "type": "core::array::Span::<core::integer::u64>"
        }
      ]
    },
    {
      "type": "struct",
      "name": "core::array::Span::<core::starknet::contract_address::ContractAddress>",
      "members": [
        {
          "name": "snapshot",
          "type": "@core::array::Array::<core::starknet::contract_address::ContractAddress>"
        }
      ]
    },
    {
      "type": "enum",
      "name": "tournaments::components::models::tournament::EntryRequirement",
      "variants": [
        {
          "name": "token",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "tournament",
          "type": "tournaments::components::models::tournament::TournamentType"
        },
        {
          "name": "allowlist",
          "type": "core::array::Span::<core::starknet::contract_address::ContractAddress>"
        }
      ]
    },
    {
      "type": "enum",
      "name": "core::option::Option::<tournaments::components::models::tournament::EntryRequirement>",
      "variants": [
        {
          "name": "Some",
          "type": "tournaments::components::models::tournament::EntryRequirement"
        },
        {
          "name": "None",
          "type": "()"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::Tournament",
      "members": [
        {
          "name": "id",
          "type": "core::integer::u64"
        },
        {
          "name": "created_at",
          "type": "core::integer::u64"
        },
        {
          "name": "created_by",
          "type": "core::starknet::contract_address::ContractAddress"
        },
        {
          "name": "creator_token_id",
          "type": "core::integer::u64"
        },
        {
          "name": "metadata",
          "type": "tournaments::components::models::tournament::Metadata"
        },
        {
          "name": "schedule",
          "type": "tournaments::components::models::schedule::Schedule"
        },
        {
          "name": "game_config",
          "type": "tournaments::components::models::tournament::GameConfig"
        },
        {
          "name": "entry_fee",
          "type": "core::option::Option::<tournaments::components::models::tournament::EntryFee>"
        },
        {
          "name": "entry_requirement",
          "type": "core::option::Option::<tournaments::components::models::tournament::EntryRequirement>"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::TournamentQualification",
      "members": [
        {
          "name": "tournament_id",
          "type": "core::integer::u64"
        },
        {
          "name": "token_id",
          "type": "core::integer::u64"
        },
        {
          "name": "position",
          "type": "core::integer::u8"
        }
      ]
    },
    {
      "type": "struct",
      "name": "core::integer::u256",
      "members": [
        {
          "name": "low",
          "type": "core::integer::u128"
        },
        {
          "name": "high",
          "type": "core::integer::u128"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::NFTQualification",
      "members": [
        {
          "name": "token_id",
          "type": "core::integer::u256"
        }
      ]
    },
    {
      "type": "enum",
      "name": "tournaments::components::models::tournament::QualificationProof",
      "variants": [
        {
          "name": "Tournament",
          "type": "tournaments::components::models::tournament::TournamentQualification"
        },
        {
          "name": "NFT",
          "type": "tournaments::components::models::tournament::NFTQualification"
        }
      ]
    },
    {
      "type": "enum",
      "name": "core::option::Option::<tournaments::components::models::tournament::QualificationProof>",
      "variants": [
        {
          "name": "Some",
          "type": "tournaments::components::models::tournament::QualificationProof"
        },
        {
          "name": "None",
          "type": "()"
        }
      ]
    },
    {
      "type": "enum",
      "name": "tournaments::components::models::tournament::Role",
      "variants": [
        {
          "name": "TournamentCreator",
          "type": "()"
        },
        {
          "name": "GameCreator",
          "type": "()"
        },
        {
          "name": "Position",
          "type": "core::integer::u8"
        }
      ]
    },
    {
      "type": "enum",
      "name": "tournaments::components::models::tournament::PrizeType",
      "variants": [
        {
          "name": "EntryFees",
          "type": "tournaments::components::models::tournament::Role"
        },
        {
          "name": "Sponsored",
          "type": "core::integer::u64"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::ERC20Data",
      "members": [
        {
          "name": "amount",
          "type": "core::integer::u128"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::ERC721Data",
      "members": [
        {
          "name": "id",
          "type": "core::integer::u128"
        }
      ]
    },
    {
      "type": "enum",
      "name": "tournaments::components::models::tournament::TokenType",
      "variants": [
        {
          "name": "erc20",
          "type": "tournaments::components::models::tournament::ERC20Data"
        },
        {
          "name": "erc721",
          "type": "tournaments::components::models::tournament::ERC721Data"
        }
      ]
    },
    {
      "type": "struct",
      "name": "tournaments::components::models::tournament::Registration",
      "members": [
        {
          "name": "tournament_id",
          "type": "core::integer::u64"
        },
        {
          "name": "game_token_id",
          "type": "core::integer::u64"
        },
        {
          "name": "entry_number",
          "type": "core::integer::u32"
        },
        {
          "name": "has_submitted",
          "type": "core::bool"
        }
      ]
    },
    {
      "type": "enum",
      "name": "tournaments::components::models::schedule::Phase",
      "variants": [
        {
          "name": "Scheduled",
          "type": "()"
        },
        {
          "name": "Registration",
          "type": "()"
        },
        {
          "name": "Staging",
          "type": "()"
        },
        {
          "name": "Live",
          "type": "()"
        },
        {
          "name": "Submission",
          "type": "()"
        },
        {
          "name": "Finalized",
          "type": "()"
        }
      ]
    },
    {
      "type": "interface",
      "name": "tournaments::components::tournament::ITournament",
      "items": [
        {
          "type": "function",
          "name": "create_tournament",
          "inputs": [
            {
              "name": "creator_rewards_address",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "metadata",
              "type": "tournaments::components::models::tournament::Metadata"
            },
            {
              "name": "schedule",
              "type": "tournaments::components::models::schedule::Schedule"
            },
            {
              "name": "game_config",
              "type": "tournaments::components::models::tournament::GameConfig"
            },
            {
              "name": "entry_fee",
              "type": "core::option::Option::<tournaments::components::models::tournament::EntryFee>"
            },
            {
              "name": "entry_requirement",
              "type": "core::option::Option::<tournaments::components::models::tournament::EntryRequirement>"
            }
          ],
          "outputs": [
            {
              "type": "tournaments::components::models::tournament::Tournament"
            }
          ],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "enter_tournament",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            },
            {
              "name": "player_name",
              "type": "core::felt252"
            },
            {
              "name": "player_address",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "qualification",
              "type": "core::option::Option::<tournaments::components::models::tournament::QualificationProof>"
            }
          ],
          "outputs": [
            {
              "type": "(core::integer::u64, core::integer::u32)"
            }
          ],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "submit_score",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            },
            {
              "name": "token_id",
              "type": "core::integer::u64"
            },
            {
              "name": "position",
              "type": "core::integer::u8"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "claim_prize",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            },
            {
              "name": "prize_type",
              "type": "tournaments::components::models::tournament::PrizeType"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "add_prize",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            },
            {
              "name": "token_address",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_type",
              "type": "tournaments::components::models::tournament::TokenType"
            },
            {
              "name": "position",
              "type": "core::integer::u8"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u64"
            }
          ],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "total_tournaments",
          "inputs": [],
          "outputs": [
            {
              "type": "core::integer::u64"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "tournament",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            }
          ],
          "outputs": [
            {
              "type": "tournaments::components::models::tournament::Tournament"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "get_registration",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            },
            {
              "name": "token_id",
              "type": "core::integer::u64"
            }
          ],
          "outputs": [
            {
              "type": "tournaments::components::models::tournament::Registration"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "tournament_entries",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u32"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "is_token_registered",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "register_token",
          "inputs": [
            {
              "name": "address",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_type",
              "type": "tournaments::components::models::tournament::TokenType"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_leaderboard",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            }
          ],
          "outputs": [
            {
              "type": "core::array::Array::<core::integer::u64>"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "current_phase",
          "inputs": [
            {
              "name": "tournament_id",
              "type": "core::integer::u64"
            }
          ],
          "outputs": [
            {
              "type": "tournaments::components::models::schedule::Phase"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "impl",
      "name": "ERC721MixinImpl",
      "interface_name": "openzeppelin_token::erc721::interface::ERC721ABI"
    },
    {
      "type": "struct",
      "name": "core::array::Span::<core::felt252>",
      "members": [
        {
          "name": "snapshot",
          "type": "@core::array::Array::<core::felt252>"
        }
      ]
    },
    {
      "type": "interface",
      "name": "openzeppelin_token::erc721::interface::ERC721ABI",
      "items": [
        {
          "type": "function",
          "name": "balance_of",
          "inputs": [
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "owner_of",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "safe_transfer_from",
          "inputs": [
            {
              "name": "from",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            },
            {
              "name": "data",
              "type": "core::array::Span::<core::felt252>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "transfer_from",
          "inputs": [
            {
              "name": "from",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "approve",
          "inputs": [
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "set_approval_for_all",
          "inputs": [
            {
              "name": "operator",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "approved",
              "type": "core::bool"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "get_approved",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "is_approved_for_all",
          "inputs": [
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "operator",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "supports_interface",
          "inputs": [
            {
              "name": "interface_id",
              "type": "core::felt252"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "name",
          "inputs": [],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "symbol",
          "inputs": [],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "token_uri",
          "inputs": [
            {
              "name": "token_id",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "balanceOf",
          "inputs": [
            {
              "name": "account",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::integer::u256"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "ownerOf",
          "inputs": [
            {
              "name": "tokenId",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "safeTransferFrom",
          "inputs": [
            {
              "name": "from",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "tokenId",
              "type": "core::integer::u256"
            },
            {
              "name": "data",
              "type": "core::array::Span::<core::felt252>"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "transferFrom",
          "inputs": [
            {
              "name": "from",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "to",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "tokenId",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "setApprovalForAll",
          "inputs": [
            {
              "name": "operator",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "approved",
              "type": "core::bool"
            }
          ],
          "outputs": [],
          "state_mutability": "external"
        },
        {
          "type": "function",
          "name": "getApproved",
          "inputs": [
            {
              "name": "tokenId",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "isApprovedForAll",
          "inputs": [
            {
              "name": "owner",
              "type": "core::starknet::contract_address::ContractAddress"
            },
            {
              "name": "operator",
              "type": "core::starknet::contract_address::ContractAddress"
            }
          ],
          "outputs": [
            {
              "type": "core::bool"
            }
          ],
          "state_mutability": "view"
        },
        {
          "type": "function",
          "name": "tokenURI",
          "inputs": [
            {
              "name": "tokenId",
              "type": "core::integer::u256"
            }
          ],
          "outputs": [
            {
              "type": "core::byte_array::ByteArray"
            }
          ],
          "state_mutability": "view"
        }
      ]
    },
    {
      "type": "constructor",
      "name": "constructor",
      "inputs": []
    },
    {
      "type": "event",
      "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
      "kind": "struct",
      "members": [
        {
          "name": "class_hash",
          "type": "core::starknet::class_hash::ClassHash",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "Upgraded",
          "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Upgraded",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "dojo::contract::components::world_provider::world_provider_cpt::Event",
      "kind": "enum",
      "variants": []
    },
    {
      "type": "event",
      "name": "tournaments::components::tournament::tournament_component::Event",
      "kind": "enum",
      "variants": []
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
      "kind": "struct",
      "members": [
        {
          "name": "from",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "to",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
      "kind": "struct",
      "members": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "approved",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "token_id",
          "type": "core::integer::u256",
          "kind": "key"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
      "kind": "struct",
      "members": [
        {
          "name": "owner",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "operator",
          "type": "core::starknet::contract_address::ContractAddress",
          "kind": "key"
        },
        {
          "name": "approved",
          "type": "core::bool",
          "kind": "data"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "Transfer",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Transfer",
          "kind": "nested"
        },
        {
          "name": "Approval",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Approval",
          "kind": "nested"
        },
        {
          "name": "ApprovalForAll",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::ApprovalForAll",
          "kind": "nested"
        }
      ]
    },
    {
      "type": "event",
      "name": "openzeppelin_introspection::src5::SRC5Component::Event",
      "kind": "enum",
      "variants": []
    },
    {
      "type": "event",
      "name": "tournaments::components::tests::mocks::tournament_mock::tournament_mock::Event",
      "kind": "enum",
      "variants": [
        {
          "name": "UpgradeableEvent",
          "type": "dojo::contract::components::upgradeable::upgradeable_cpt::Event",
          "kind": "nested"
        },
        {
          "name": "WorldProviderEvent",
          "type": "dojo::contract::components::world_provider::world_provider_cpt::Event",
          "kind": "nested"
        },
        {
          "name": "TournamentEvent",
          "type": "tournaments::components::tournament::tournament_component::Event",
          "kind": "flat"
        },
        {
          "name": "ERC721Event",
          "type": "openzeppelin_token::erc721::erc721::ERC721Component::Event",
          "kind": "flat"
        },
        {
          "name": "SRC5Event",
          "type": "openzeppelin_introspection::src5::SRC5Component::Event",
          "kind": "flat"
        }
      ]
    }
  ];
  
  // Initialize contract
  let contract = null;
  console.log("provider", provider);
  console.log('account', account);
  if (provider) {
    contract = new Contract(abi, contractAddress, provider);
  }
  
  // Fetch total tournaments when component loads
  useEffect(() => {
    const fetchTotalTournaments = async () => {
        console.log("contract", contract);
      if (contract) {
        try {
          const result = await contract.total_tournaments();
          setTotalTournaments(Number(result));
        } catch (error) {
          console.error("Error fetching total tournaments:", error);
        }
      }
    };
    
    fetchTotalTournaments();

    const fetchTournamentEntries = async () => {
        console.log("contract", contract);
      if (contract) {
        try {
          const result = await contract.tournament_entries(2);
          console.log("t entries", result);
        } catch (error) {
          console.error("Error fetching total tournaments:", error);
        }
      }
    };
    
    fetchTournamentEntries();
  }, [provider]);
  
  // Enter tournament function
  const enterTournament = async () => {
    console.log('entering tournament');
    console.log("account", account);
    console.log("contract", contract);
    if (!account || !contract) {
      setStatus("Error: No account connected or contract not initialized");
      return;
    }
    
    try {
      setStatus("Preparing transaction...");
      
      // Connect contract with account for write operations
      // Qualification is set to None option in this example
      const qualification = { None: {} };
      
      // Execute the enter_tournament function
/*       const { transaction_hash } = await contract.enter_tournament(
        tournamentId,
        playerName,
        account.address,
        qualification
      ); */

      const calldata = {
        contractAddress,
        entrypoint: "enter_tournament",
        calldata: [
          tournamentId,
          playerName,
          account.address,
          1
        ]
      };
      
      console.log("Executing with calldata:", calldata);
      
      // Use the account to execute the call
      const { transaction_hash } = await account.execute(calldata);


      console.log("transaction_hash", transaction_hash);
      
      setHash(transaction_hash);
      setStatus("Transaction submitted! Waiting for confirmation...");
      
      // Wait for transaction to be confirmed
      const response = await provider.waitForTransaction(transaction_hash); 
      console.log("response", response);
      setStatus("Successfully entered tournament!");
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setStatus(`Error: ${error.message}`);
    }
  };
  
  return (
    <Box color="white">
      <h2 className="text-xl font-bold mb-4">Tournament Interactions</h2>
      
      <div className="mb-4">
        <p>Contract: {contractAddress}</p>
        <p>Account: {account?.address || "Not connected"}</p>
        <p>Total Tournaments: {totalTournaments}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-bold mb-2">Enter Tournament</h3>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Tournament ID"
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="p-2 border rounded"
          />
          <Button 
            onClick={enterTournament}
            // disabled={!account || !tournamentId || !playerName}
            // className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Enter Tournament
          </Button>
        </div>
      </div>
      
      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p><strong>Status:</strong> {status}</p>
          {hash && <p><strong>Transaction Hash:</strong> {hash}</p>}
        </div>
      )}
    </Box>
  );
}