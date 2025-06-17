
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Download, 
  Upload,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'candidate',
      status: 'active',
      lastLogin: '2024-01-15 14:30',
      interviews: 5,
      verified: true,
      joinDate: '2023-12-01'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@techcorp.com',
      role: 'recruiter',
      status: 'active',
      lastLogin: '2024-01-15 16:45',
      interviews: 23,
      verified: true,
      joinDate: '2023-10-15'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@startup.io',
      role: 'candidate',
      status: 'inactive',
      lastLogin: '2024-01-10 09:15',
      interviews: 2,
      verified: false,
      joinDate: '2024-01-05'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@enterprise.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 17:20',
      interviews: 0,
      verified: true,
      joinDate: '2023-08-20'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@company.com',
      role: 'recruiter',
      status: 'suspended',
      lastLogin: '2024-01-12 11:30',
      interviews: 15,
      verified: true,
      joinDate: '2023-11-10'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-tech-green/20 text-tech-green border-tech-green/30">Active</Badge>;
      case 'inactive': return <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">Inactive</Badge>;
      case 'suspended': return <Badge className="bg-red-400/20 text-red-400 border-red-400/30">Suspended</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-purple-400/20 text-purple-400 border-purple-400/30">Admin</Badge>;
      case 'recruiter': return <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30">Recruiter</Badge>;
      case 'candidate': return <Badge className="bg-green-400/20 text-green-400 border-green-400/30">Candidate</Badge>;
      default: return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">Unknown</Badge>;
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">User Management</h2>
          <p className="text-text-secondary mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
            <Download size={16} className="mr-2" />
            Export Users
          </Button>
          <Button variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
            <Upload size={16} className="mr-2" />
            Import Users
          </Button>
          <Button className="bg-tech-green hover:bg-tech-green/90 text-dark-primary">
            <UserPlus size={16} className="mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-dark-primary border-border-dark text-text-primary"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-dark-primary border-border-dark text-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-secondary border-border-dark">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-dark-primary border-border-dark text-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-secondary border-border-dark">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="bg-dark-secondary border-border-dark">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-text-primary">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                  Activate
                </Button>
                <Button size="sm" variant="outline" className="border-border-dark text-text-secondary hover:text-text-primary">
                  Suspend
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card className="bg-dark-secondary border-border-dark">
        <CardHeader>
          <CardTitle className="text-text-primary flex items-center gap-2">
            <Users className="h-5 w-5 text-tech-green" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border-dark">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-text-secondary">User</TableHead>
                <TableHead className="text-text-secondary">Role</TableHead>
                <TableHead className="text-text-secondary">Status</TableHead>
                <TableHead className="text-text-secondary">Last Login</TableHead>
                <TableHead className="text-text-secondary">Interviews</TableHead>
                <TableHead className="text-text-secondary">Verified</TableHead>
                <TableHead className="text-text-secondary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border-dark">
                  <TableCell>
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-text-primary">{user.name}</p>
                      <p className="text-sm text-text-secondary">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-text-secondary">{user.lastLogin}</TableCell>
                  <TableCell className="text-text-primary">{user.interviews}</TableCell>
                  <TableCell>
                    {user.verified ? (
                      <CheckCircle size={16} className="text-tech-green" />
                    ) : (
                      <XCircle size={16} className="text-red-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
