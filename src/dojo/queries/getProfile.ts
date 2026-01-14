import { Account, AccountInterface } from "starknet";

export const getProfile = async (
  client: any,
  userAddress: string
): Promise<Profile | null> => {
  try {
    let tx_result: any =
      await client.profile_system.getProfile(
        userAddress
      );

    return {
        username: tx_result.username,
        totalXp: Number(tx_result.total_xp ?? 0),
        currentXp: Number(tx_result.xp),
        level: Number(tx_result.level),
        streak: Number(tx_result.daily_streak),
        avatarId: Number(tx_result.avatar_id),
    };
    
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getPlayerStats = async (
  client: any,
  userAddress: string
): Promise<PlayerStats | null> => {
  try {
    let tx_result: any =
      await client.profile_system.getPlayerStats(
        userAddress
      );
    
    return {
        games: Number(tx_result.games_played),
        victories: Number(tx_result.games_won),
    };
    
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getProfileLevelConfigByAddress = async (
  client: any,
  userAddress: string
): Promise<number | null> => {
  try {
    let tx_result: any =
      await client.profile_system.getProfileLevelConfigByAddress(
        userAddress
      );
    
    return Number(tx_result.required_xp);
    
  } catch (e) {
    console.log(e);
    return null;
  }
};


export const createProfile = async (
  client: any,
  snAccount: Account | AccountInterface, address: string,
  username: string,
  avatarId: number
): Promise<void> => {
  try {
      await client.profile_system.createProfile(
        snAccount,
        address,
        username,
        avatarId
      );
        
  } catch (e) {
    console.log(e);
  }
};

export const updateAvatar = async (
  client: any,
  snAccount: Account | AccountInterface, address: string,
  avatarId: number
): Promise<void> => {
  try {
      await client.profile_system.updateAvatar(
        snAccount,
        address,
        avatarId
      );
        
  } catch (e) {
    console.log(e);
  }
};
