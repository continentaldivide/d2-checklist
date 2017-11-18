
export class ActivityMode {
    name: string;
    type: number;
    desc: string;

    constructor(type: number, name: string, desc: string) {
        this.type = type;
        this.name = name;
        this.desc = desc;
    }
}

export interface SearchResult {
    iconPath: string;
    membershipType: number;
    membershipId: string;
    displayName: string;
}

export class SelectedUser {
    selectedUser: UserInfo;
    selectedUserCurrencies: Currency[];
    membership: BungieMembership;
}

export class BungieMembership {
    bungieId: string;
    clans: ClanRow[];
    destinyMemberships: UserInfo[];
}

export class BungieGroupMember {
    memberType: number;
    isOnline: boolean;
    groupId: string;
    destinyUserInfo: UserInfo;
    bungieNetUserInfo: BungieNetUserInfo;
    joinDate: string;
    player: Player;
}

export interface BungieNetUserInfo {
    supplementalDisplayName: string;
    iconPath: string;
    membershipType: number;
    membershipId: string;
    displayName: string;
}

export interface UserInfo {
    membershipType: number;
    membershipId: string;
    platformName: string;
    displayName: string;
    icon: string;
}

export class LeaderBoardList {
    name: string;
    entries: LeaderboardEntry[];

    constructor(name: string, entries: LeaderboardEntry[]) {
        this.name = name;
        this.entries = entries;
    }
}

export class LeaderboardEntry {
    destinyUserInfo: UserInfo;
    characterId: string;
    characterClass: string;
    light: number;
    rank: number;
    value: number;
}


export interface Profile {
    userInfo: UserInfo;
    dateLastPlayed: string;
    versionsOwned: number;
    characterIds: string[];
}

export class Rankup{
    hash: number;
    name: string;
    xyz300: boolean;

    constructor(hash: number, name: string){
        this.hash = hash;
        this.name = name;
    }
}

export class Player {
    profile: Profile;
    superprivate: boolean;
    hasWellRested: boolean;
    currentActivity: CurrentActivity;
    characters: Character[];
    milestoneList: MileStoneName[];
    currencies: Currency[];
    gear: InventoryItem[];
    rankups: Rankup[];

    constructor(profile: Profile, characters: Character[], currentActivity: CurrentActivity, milestoneList: MileStoneName[], currencies: Currency[], gear: InventoryItem[], rankups: Rankup[], superprivate: boolean, hasWellRested: boolean) {
        this.profile = profile;
        this.characters = characters;
        this.currentActivity = currentActivity;
        this.milestoneList = milestoneList;
        this.currencies = currencies;
        this.gear = gear;
        this.rankups = rankups;
        this.superprivate = superprivate;
        this.hasWellRested = hasWellRested;
    }
}

export class InventoryItem {
    readonly hash: string;
    readonly name: string;
    readonly equipped: boolean;
    readonly icon: string;
    readonly owner?: Character;
    readonly type: ItemType;
    readonly typeName: string;
    readonly quantity: number;
    readonly power: number;
    readonly damageType: DamageType;
    readonly perks: Perk[];
    readonly stats: InventoryStat[];
    readonly sockets: InventorySocket[];

    //more to come, locked other stuff

    damageTypeString(): string{
        return DamageType[this.damageType];
    }

    typeString(): string{
        return ItemType[this.type];
    }

    constructor(hash: string, name: string, equipped: boolean, owner: Character, 
        icon: string, type: ItemType, typeName: string, quantity: number,
        power: number, damageType: DamageType, perks: Perk[], stats: InventoryStat[], sockets: InventorySocket[]
    ) {
        this.hash = hash;
        this.name = name;
        this.equipped = equipped;
        this.owner = owner;
        this.icon = icon;
        this.type = type;
        this.typeName = typeName;
        this.quantity = quantity;
        this.power = power;
        this.damageType = damageType;
        this.perks = perks;
        this.stats = stats;
        this.sockets = sockets;
    }
}

export class Currency {
    name: string;
    icon: string;
    count: number;

    constructor(name: string, icon: string, count: number) {
        this.name = name;
        this.icon = icon;
        this.count = count;
    }
}

export class MilestoneStatus {
    hash: string;
    complete: boolean;
    pct: number;
    info: string;

    constructor(hash, complete, pct, info) {
        this.hash = hash;
        this.complete = complete;
        this.pct = pct;
        this.info = info;
    }
}

export interface MileStoneName {
    key: string;
    type: string;
    name: string;
    desc: string;
    hasPartial: boolean;
}

export class Character {
    membershipId: string;
    membershipType: number;
    characterId: string;
    dateLastPlayed: string;
    minutesPlayedThisSession: string;
    minutesPlayedTotal: string;
    light: number;
    emblemBackgroundPath: string;
    emblemPath: string;
    baseCharacterLevel: number;
    percentToNextLevel: number;
    race: string;
    gender: string;
    className: string;
    levelProgression: LevelProgression;
    legendProgression: Progression;
    wellRested: boolean = false;
    currentActivity: CurrentActivity;
    milestones: { [key: string]: MilestoneStatus };
    clanMilestones: ClanMilestoneResults;
    factions: Progression[];
    //progressions: Progression[];
    stats: CharacterStat[];
    startWeek: Date;
    endWeek: Date;
    lifetimeRaid: number = 0;
    lifetimeRaidNormal: number = 0;
    lifetimeRaidPrestige: number = 0;
    aggHistory: AggHistory;

}

export class Nightfall {
    name: string;
    desc: string;
    tiers: number[];
    modifiers: NameDesc[];
    challenges: NameDesc[];
    image: string;
}

export class AggHistory{
    nf: number=0;
    nfFastestMs: number;
    
    hmNf: number=0;
    hmNfFastestMs: number;

    raid: number=0;
    raidFastestMs: number;
    
    hmRaid: number=0;
    hmRaidFastestMs: number;
}



export class NameDesc {
    name: string;
    desc: string;

    constructor(name: string, desc: string) {
        this.name = name;
        this.desc = desc;
    }
}

export class CharacterStat {
    name: string;
    desc: string;
    value: number;

    constructor(name, desc, value) {
        this.name = name;
        this.desc = desc;
        this.value = value;
    }
}

export class ClanMilestoneResults {
    nightfall: boolean;
    raid: boolean;
    crucible: boolean;
    trials: boolean;
}

export interface LevelProgression {
    progressionHash: number;
    dailyProgress: number;
    dailyLimit: number;
    weeklyProgress: number;
    weeklyLimit: number;
    currentProgress: number;
    level: number;
    levelCap: number;
    stepIndex: number;
    progressToNextLevel: number;
    nextLevelAt: number;
}

export class PGCR {
    period: string;
    activityDurationSeconds: number;
    finish: string;
    //Acitivity Details
    referenceId: number;
    instanceId: string;
    mode: string;
    name: string; //from referenceId
    isPrivate: boolean;
    entries: PGCREntry[];
    level: number;
    teams: PGCRTeam[];
    pveSuccess?: boolean;
    pve: boolean;

}

export class PGCRTeam {
    name: string;
    standing: string;
    score: number;
}


export class CurrentActivity {
    dateActivityStarted: string;
    name: string;
    type: string;
    activityLevel: number;
    activityLightLevel: number;
}

export class Activity {
    period: string;
    type: string;
    mode: string;
    name: string;
    desc: string;
    pvType: string;
    completed: number;
    timePlayedSeconds: number;
    playerCount: number;
    standing: number;
    kills: number;
    deaths: number;
    kd: number;
    assists: number;
    score: number;
    completionReason: number;
    success: boolean;

    activityLevel: number;
    activityLightLevel: number;
    referenceId: number;
    instanceId: string;
    activityTypeHashOverride: number;
    isPrivate: boolean;
}


export class PGCREntry {
    standing: number;
    score: number;
    values: any;
    kd: number;
    user: UserInfo;

    characterId: string;
    characterClass: string;
    characterLevel: number;
    lightLevel: number;

    kills: number;
    deaths: number;
    assists: number;
    fireteamId: number;
    fireteamSize: number;
    team: string;
    completionReason: number;

    startSeconds: number;
    activityDurationSeconds: number;
    timePlayedSeconds: number;

    weapons: PGCRWeaponData[];

}

export class PGCRWeaponData {
    hash: string;
    name: string;
    type: string;
    kills: number;
    precPct: number;
}


export class Platform {
    name: string;
    type: number;
    desc: string;

    constructor(type: number, name: string, desc: string) {
        this.type = type;
        this.name = name;
        this.desc = desc;
    }
}

export class ClanRow{
    name: string;
    id: string;
    constructor(name: string, id: string) {
        this.id = id;
        this.name = name;
    }
}

export class BungieMember {
    name: string;
    id: string;
    noClan: boolean = false;
    clans: ClanRow[] = null;
    xbl: BungieMemberPlatform;
    psn: BungieMemberPlatform;
    bnet: BungieMemberPlatform;

    constructor(name: string, id: string, xbl: BungieMemberPlatform, psn: BungieMemberPlatform, bnet: BungieMemberPlatform) {
        this.id = id;
        this.name = name;
        this.xbl = xbl;
        this.psn = psn;
        this.bnet = bnet;
    }
}

export class BungieMemberPlatform {
    name: string;
    platform: Platform;
    defunct: boolean = false;

    constructor(name: string, platform: Platform) {
        this.name = name;
        this.platform = platform;
    }
}

export class ClanInfo {

    groupId: string;
    name: string;
    creationDate: string;
    memberCount: number;
    avatarPath: string;
    bannerPath: string;
    progressions: Progression[];
}


export class Progression {
    icon: string;
    name: string;
    info: string;
    desc: string;
    hash: number;
    nextLevelAt: number;
    progressToNextLevel: number;
    tokensNeeded: number;
    progressionHash: number;
    level: number;
    levelCap: number;

    dailyProgress: number;
    dailyLimit: number;
    weeklyProgress: number;
    weeklyLimit: number;
    currentProgress: number;

    percentToNextLevel: number;
    tokensHeld?: number;

    xyz300: boolean;
}

export class Const {

    public static XBL_PLATFORM = new Platform(1, "XBL", "Xbox");
    public static PSN_PLATFORM = new Platform(2, "PSN", "Playstation");
    public static BNET_PLATFORM = new Platform(4, "BNET", "Battle.net");

    public static PLATFORMS_ARRAY = [
        Const.XBL_PLATFORM, Const.PSN_PLATFORM, Const.BNET_PLATFORM
    ];

    public static PLATFORMS_DICT = {
        "1": Const.XBL_PLATFORM,
        "2": Const.PSN_PLATFORM,
        "4": Const.BNET_PLATFORM
    }
}

export class InventoryStat {
    readonly name: string;
    readonly desc: string;
    readonly value: number;

    constructor(name, desc, value) {
        this.name = name;
        this.desc = desc;
        this.value = value;
    }
}

export class InventorySocket{
    readonly plugs: InventoryPlug[];
    readonly bonusLight: number;

    constructor(plugs:InventoryPlug[], bonusLight: number){
        this.plugs = plugs;
        this.bonusLight = bonusLight;

    }

}

export class InventoryPlug{
    readonly hash: string;
    readonly name: string;
    readonly desc: string;
    readonly active: boolean;

    constructor(hash: string, name: string, desc: string, active: boolean){
        this.hash = hash;
        this.name = name;
        this.desc = desc;
        this.active = active;
    }
}

export class Perk{

    readonly hash: string;
    readonly name: string;
    readonly desc: string;
    readonly icon: string;
    readonly active: boolean;
    readonly visible: boolean;

    constructor(hash: string, name: string, desc: string, icon: string, active: boolean, visible:boolean){
        this.hash = hash;
        this.name = name;
        this.desc = desc;
        this.icon = icon;
        this.active = active;
        this.visible = visible;
    }
    
}

export enum ItemType {
    None = 0,
    Currency = 1,
    Armor = 2,
    Weapon = 3,
    Message = 7,
    Engram = 8,
    Consumable = 9,
    ExchangeMaterial = 10,
    MissionReward = 11,
    QuestStep = 12,
    QuestStepComplete = 13,
    Emblem = 14,
    Quest = 15,
    Subclass = 16,
    ClanBanner = 17,
    Aura = 18,
    Mod = 19
}

export enum DamageType{
    None= 0,
    Kinetic= 1,
    Arc= 2,
    Thermal= 3,
    Void= 4,
    Raid= 5
}

export class Socket{

}