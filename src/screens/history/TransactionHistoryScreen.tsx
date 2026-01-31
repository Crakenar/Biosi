import React, {useState, useMemo} from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HistoryStackParamList} from '../../navigation/types';
import {useTheme} from '../../contexts/ThemeContext';
import {useUserStore} from '../../store/userStore';
import {useTransactionStore} from '../../store/transactionStore';
import {useSettingsStore} from '../../store/settingsStore';
import {Input} from '../../components/common/Input';
import {Card} from '../../components/common/Card';
import {formatCurrency} from '../../utils/formatters';
import {formatHours} from '../../services/calculations';
import {formatDateTime} from '../../utils/dateHelpers';
import {aggregateTransactions} from '../../utils/aggregations';
import {useTranslation} from 'react-i18next';
import {subMonths, isAfter} from 'date-fns';

type HistoryNavigationProp = StackNavigationProp<HistoryStackParamList, 'TransactionHistory'>;

type FilterType = 'all' | 'purchased' | 'saved';

export const TransactionHistoryScreen: React.FC = () => {
    const navigation = useNavigation<HistoryNavigationProp>();
    const {theme} = useTheme();
    const {user} = useUserStore();
    const {t} = useTranslation();
    const {transactions} = useTransactionStore();
    const {settings} = useSettingsStore();

    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        // Apply 3-month limit for free users
        if (!settings.isPremium) {
            const threeMonthsAgo = subMonths(new Date(), 3);
            result = result.filter((t) => isAfter(new Date(t.timestamp), threeMonthsAgo));
        }

        if (filter !== 'all') {
            result = result.filter((t) => t.type === filter);
        }

        if (searchQuery) {
            result = result.filter(
                (t) =>
                    t.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.itemPrice.toString().includes(searchQuery)
            );
        }

        return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [transactions, filter, searchQuery, settings.isPremium]);

    const stats = useMemo(() => aggregateTransactions(filteredTransactions), [filteredTransactions]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    if (!user) {
        return null;
    }

    const FilterButton = ({type, label}: {
        type: FilterType;
        label: string
    }) => (
        <TouchableOpacity
            style={{
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
                backgroundColor: filter === type ? theme.colors.primary : theme.colors.surface,
                borderRadius: theme.borderRadius.md,
                borderWidth: 1,
                borderColor: filter === type ? theme.colors.primary : theme.colors.border,
            }}
            onPress={() => setFilter(type)}
        >
            <Text
                style={{
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: '600',
                    color: filter === type ? '#FFFFFF' : theme.colors.text,
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={{flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header */}
            <View style={{
                padding: theme.spacing.xl,
                paddingBottom: theme.spacing.md,
                paddingTop: theme.spacing.xxl * 1.5
            }}>
                <Text
                    style={{
                        fontSize: theme.typography.sizes.xxl,
                        fontWeight: 'bold',
                        color: theme.colors.text,
                        marginBottom: theme.spacing.md,
                    }}
                >
                    {t('history.title')}
                </Text>

                {/* Premium Limit Banner */}
                {!settings.isPremium && (
                    <TouchableOpacity
                        style={{
                            backgroundColor: theme.colors.primary,
                            padding: theme.spacing.md,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.md,
                        }}
                        onPress={() => navigation.navigate('SettingsTab', {
                            screen: 'PremiumPurchase'
                        } as any)}
                    >
                        <Text style={{
                            color: '#fff',
                            fontSize: theme.typography.sizes.sm,
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>
                            ✨ Showing last 3 months • Upgrade to Premium for unlimited history
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Summary Stats */}
                <Card variant="elevated"
                      style={{marginBottom: theme.spacing.md}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>
                        <View style={{alignItems: 'center'}}>
                            <Text
                                style={{
                                    fontSize: theme.typography.sizes.xs,
                                    color: theme.colors.textSecondary,
                                    marginBottom: theme.spacing.xs,
                                }}
                            >
                                {t('history.totalTransactions')}
                            </Text>
                            <Text
                                style={{
                                    fontSize: theme.typography.sizes.lg,
                                    fontWeight: 'bold',
                                    color: theme.colors.text,
                                }}
                            >
                                {filteredTransactions.length}
                            </Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text
                                style={{
                                    fontSize: theme.typography.sizes.xs,
                                    color: theme.colors.textSecondary,
                                    marginBottom: theme.spacing.xs,
                                }}
                            >
                                {t('history.totalSpent')}
                            </Text>
                            <Text
                                style={{
                                    fontSize: theme.typography.sizes.lg,
                                    fontWeight: 'bold',
                                    color: theme.colors.error,
                                }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.7}
                            >
                                {formatCurrency(stats.totalSpent, user.currency)}
                            </Text>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <Text
                                style={{
                                    fontSize: theme.typography.sizes.xs,
                                    color: theme.colors.textSecondary,
                                    marginBottom: theme.spacing.xs,
                                }}
                            >
                                {t('history.totalSaved')}
                            </Text>
                            <Text
                                style={{
                                    fontSize: theme.typography.sizes.lg,
                                    fontWeight: 'bold',
                                    color: theme.colors.success,
                                }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.7}
                            >
                                {formatCurrency(stats.totalSaved, user.currency)}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Filters */}
                <View style={{
                    flexDirection: 'row',
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.md
                }}>
                    <FilterButton type="all" label={t('history.all')}/>
                    <FilterButton type="purchased"
                                  label={t('history.purchased')}/>
                    <FilterButton type="saved" label={t('history.saved')}/>
                </View>

                {/* Search */}
                <Input
                    placeholder={t('history.searchPlaceholder')}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Transaction List */}
            {filteredTransactions.length === 0 ? (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: theme.spacing.xl
                }}>
                    <Text style={{
                        fontSize: 64,
                        marginBottom: theme.spacing.md
                    }}>📊</Text>
                    <Text
                        style={{
                            fontSize: theme.typography.sizes.lg,
                            fontWeight: 'bold',
                            color: theme.colors.text,
                            textAlign: 'center',
                            marginBottom: theme.spacing.sm,
                        }}
                    >
                        {t('history.noTransactions')}
                    </Text>
                    <Text
                        style={{
                            fontSize: theme.typography.sizes.md,
                            color: theme.colors.textSecondary,
                            textAlign: 'center',
                        }}
                    >
                        {searchQuery ? t('history.tryDifferentSearch') : t('history.noTransactionsDesc')}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        paddingHorizontal: theme.spacing.xl,
                        paddingBottom: theme.spacing.xl
                    }}
                    refreshControl={<RefreshControl refreshing={refreshing}
                                                    onRefresh={onRefresh}/>}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                backgroundColor: theme.colors.surface,
                                padding: theme.spacing.md,
                                borderRadius: theme.borderRadius.md,
                                marginBottom: theme.spacing.sm,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}
                            onPress={() => navigation.navigate('TransactionDetail', {transactionId: item.id})}
                        >
                            <View
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: theme.borderRadius.round,
                                    backgroundColor: item.type === 'purchased' ? theme.colors.error : theme.colors.success,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: theme.spacing.md,
                                    opacity: 0.2,
                                }}
                            >
                                <Text
                                    style={{fontSize: 24}}>{item.type === 'purchased' ? '💸' : '🎯'}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: theme.spacing.xs
                                }}>
                                    <View style={{flex: 1, marginRight: theme.spacing.sm}}>
                                        <Text
                                            style={{
                                                fontSize: theme.typography.sizes.md,
                                                fontWeight: '600',
                                                color: theme.colors.text,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {item.label || (item.type === 'purchased' ? t('history.purchased') : t('history.saved'))}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: theme.typography.sizes.xs,
                                                color: theme.colors.textSecondary,
                                                marginTop: 2,
                                            }}
                                        >
                                            {item.type === 'purchased' ? t('history.purchased') : t('history.saved')}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: theme.typography.sizes.md,
                                            fontWeight: 'bold',
                                            color: item.type === 'purchased' ? theme.colors.error : theme.colors.success,
                                        }}
                                        numberOfLines={1}
                                        adjustsFontSizeToFit
                                        minimumFontScale={0.7}
                                    >
                                        {settings.displayMode === 'hours'
                                            ? formatHours(item.hoursOfWork, settings.workHoursPerDay)
                                            : formatCurrency(item.itemPrice, user.currency)}
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text
                                        style={{
                                            fontSize: theme.typography.sizes.xs,
                                            color: theme.colors.textSecondary,
                                        }}
                                    >
                                        {formatDateTime(item.timestamp)}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: theme.typography.sizes.xs,
                                            color: theme.colors.textSecondary,
                                        }}
                                    >
                                        {settings.displayMode === 'hours'
                                            ? formatCurrency(item.itemPrice, user.currency)
                                            : formatHours(item.hoursOfWork, settings.workHoursPerDay)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({});
