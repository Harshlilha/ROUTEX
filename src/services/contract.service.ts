import { supabase } from '../lib/supabase';
import { Contract } from '../types';

export const contractService = {
  async getContracts(limit = 100): Promise<Contract[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .order('contract_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getContractById(id: string): Promise<Contract | null> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getContractsBySupplier(supplierId: string): Promise<Contract[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('contract_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getContractStats() {
    const { data, error } = await supabase
      .from('contracts')
      .select('*');

    if (error) throw error;

    const contracts = data || [];
    const totalValue = contracts.reduce((sum, c) => sum + c.contract_value_inr, 0);
    const avgOnTime = contracts.reduce((sum, c) => sum + c.on_time_delivery_pct, 0) / contracts.length;
    const avgDefectRate = contracts.reduce((sum, c) => sum + c.defect_rate_pct, 0) / contracts.length;
    const aiWins = contracts.filter(c => c.decision_winner === 'AI').length;
    const humanWins = contracts.filter(c => c.decision_winner === 'Human').length;
    const conflicts = contracts.filter(c => c.ai_human_conflict > 5).length;

    return {
      totalContracts: contracts.length,
      totalValue,
      avgOnTime,
      avgDefectRate,
      aiWins,
      humanWins,
      conflicts,
    };
  },

  async getContractsWithDisruptions(): Promise<Contract[]> {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('disruption_flag', 1)
      .order('contract_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
